import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../logger/logger.js";
import type { ITaxRulePackage } from "../domain/types.js";

export interface IPackageCatalogItem {
  packageCode: string;
  name: string;
  version: string;
  jurisdictionCode: string;
  manifestChecksum: string;
  ruleCount: number;
  sizeBytes: number;
  fileName: string;
  downloadUrl: string;
  generatedAt: string;
}

export interface IPackageServerOptions {
  packagesDir?: string;
  port?: number;
}

/**
 * Resolves the default packages directory location.
 */
export function getDefaultPackagesDir(): string {
  try {
    const currentDir = fileURLToPath(new URL(".", import.meta.url));
    return resolve(currentDir, "../../packages");
  } catch {
    return resolve(process.cwd(), "packages");
  }
}

/**
 * Scans packages directory and compiles metadata for all sealed .taxpack.json files.
 */
export function buildPackageCatalog(packagesDir: string): IPackageCatalogItem[] {
  if (!existsSync(packagesDir)) {
    return [];
  }

  const files = readdirSync(packagesDir).filter((f) => f.endsWith(".taxpack.json"));
  const items: IPackageCatalogItem[] = [];

  for (const fileName of files) {
    try {
      const fullPath = join(packagesDir, fileName);
      const stats = statSync(fullPath);
      const content = readFileSync(fullPath, "utf8");
      const pkg = JSON.parse(content) as ITaxRulePackage;

      items.push({
        packageCode: pkg.packageCode,
        name: pkg.name,
        version: pkg.version,
        jurisdictionCode: pkg.jurisdictionCode,
        manifestChecksum: pkg.manifestChecksum ?? "",
        ruleCount: pkg.rules?.length ?? 0,
        sizeBytes: stats.size,
        fileName,
        downloadUrl: `/packages/${encodeURIComponent(fileName)}`,
        generatedAt: pkg.generatedAt
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(`Failed to inspect package file ${fileName}: ${msg}`);
    }
  }

  return items.sort((a, b) => a.packageCode.localeCompare(b.packageCode));
}

/**
 * Handles CORS and content type headers for package server responses.
 */
function setCorsHeaders(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Resolves safe file path for a package download, tolerating colons or missing extensions.
 */
function resolvePackagePath(fileName: string, packagesDir: string): { targetPath: string; safeName: string } | null {
  const normalized = fileName.replace(/^:+/, "").trim();
  let safeName = basename(normalized);
  const resolvedDir = resolve(packagesDir);
  let targetPath = resolve(packagesDir, safeName);

  if (!existsSync(targetPath) && !safeName.endsWith(".taxpack.json")) {
    const candidateName = `${safeName}.taxpack.json`;
    const candidatePath = resolve(packagesDir, candidateName);
    if (existsSync(candidatePath)) {
      safeName = candidateName;
      targetPath = candidatePath;
    }
  }

  if (!targetPath.startsWith(resolvedDir) || !existsSync(targetPath)) {
    return null;
  }
  return { targetPath, safeName };
}

/**
 * Serves single package download by safe file name.
 */
function handlePackageDownload(
  fileName: string,
  packagesDir: string,
  res: ServerResponse
): void {
  const resolved = resolvePackagePath(fileName, packagesDir);
  if (!resolved) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      error: "Package not found",
      requested: fileName,
      hint: "Omit any leading colon ':' in the URL. Example: /packages/US-FED-2026.taxpack.json"
    }));
    return;
  }

  const content = readFileSync(resolved.targetPath, "utf8");
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Disposition": `attachment; filename="${resolved.safeName}"`
  });
  res.end(content);
}

/**
 * Main HTTP request router for the package distribution server.
 */
export function createPackageRequestHandler(packagesDir: string) {
  return (req: IncomingMessage, res: ServerResponse): void => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const rawUrl = req.url ?? "/";
    const parsedUrl = new URL(rawUrl, "http://localhost");
    const pathname = parsedUrl.pathname;

    if (pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "tax-rule-package-server" }));
      return;
    }

    if (pathname === "/packages" || pathname === "/packages/" || pathname === "/api/v1/packages") {
      const catalog = buildPackageCatalog(packagesDir);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ packages: catalog, count: catalog.length }));
      return;
    }

    if (pathname.startsWith("/packages/")) {
      const fileName = decodeURIComponent(pathname.replace(/^\/packages\//, ""));
      handlePackageDownload(fileName, packagesDir, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  };
}

/**
 * Creates an HTTP server instance configured with the package request handler.
 */
export function createPackageServer(packagesDir?: string): Server {
  const dir = packagesDir ?? getDefaultPackagesDir();
  return createServer(createPackageRequestHandler(dir));
}

/**
 * Starts the package server on the specified port.
 */
export function startPackageServer(options?: IPackageServerOptions): Promise<{ server: Server; port: number }> {
  const port = options?.port ?? Number(process.env.PORT || 3333);
  const dir = options?.packagesDir ?? getDefaultPackagesDir();
  const server = createPackageServer(dir);

  return new Promise((resolvePromise, rejectPromise) => {
    server.on("error", (err) => {
      logger.error(`Package server error: ${err.message}`);
      rejectPromise(err);
    });

    server.listen(port, () => {
      logger.info(`Tax Rule Package Server active at http://localhost:${port}`);
      logger.info(`Serving packages from: ${dir}`);
      resolvePromise({ server, port });
    });
  });
}

if (process.argv[1]?.endsWith("server.ts") || process.argv[1]?.endsWith("server.js")) {
  const requestedPort = process.argv[2] ? Number(process.argv[2]) : undefined;
  void startPackageServer({ port: requestedPort });
}

