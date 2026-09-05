import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  createPackageServer,
  buildPackageCatalog,
  getDefaultPackagesDir,
  type IPackageCatalogItem
} from "../../src/server/server.js";

describe("Package Distribution Server", () => {
  let server: Server;
  let baseUrl: string;
  const packagesDir = getDefaultPackagesDir();

  beforeAll(async () => {
    server = createPackageServer(packagesDir);
    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("builds package catalog from sealed reference packages", () => {
    const catalog = buildPackageCatalog(packagesDir);
    expect(catalog.length).toBeGreaterThanOrEqual(4);

    const fed = catalog.find((p) => p.packageCode === "US-FED-2026");
    expect(fed).toBeDefined();
    expect(fed?.manifestChecksum.startsWith("sha256:")).toBe(true);
    expect(fed?.fileName).toBe("US-FED-2026.taxpack.json");
  });

  it("responds with 200 OK on GET /health", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { status: string; service: string };
    expect(body.status).toBe("ok");
    expect(body.service).toBe("tax-rule-package-server");
  });

  it("returns package catalog on GET /packages", async () => {
    const res = await fetch(`${baseUrl}/packages`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { packages: IPackageCatalogItem[]; count: number };
    expect(body.count).toBeGreaterThanOrEqual(4);
    expect(Array.isArray(body.packages)).toBe(true);

    const pa = body.packages.find((p) => p.packageCode === "PA-STATE-2026");
    expect(pa).toBeDefined();
    expect(pa?.downloadUrl).toBe("/packages/PA-STATE-2026.taxpack.json");
  });

  it("serves raw canonical taxpack on GET /packages/:fileName", async () => {
    const res = await fetch(`${baseUrl}/packages/US-FED-2026.taxpack.json`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");

    const pkg = (await res.json()) as { packageCode: string; rules: unknown[] };
    expect(pkg.packageCode).toBe("US-FED-2026");
    expect(pkg.rules.length).toBe(3);
  });

  it("tolerates leading colon in route parameter e.g. /packages/:US-FED-2026.taxpack.json", async () => {
    const res = await fetch(`${baseUrl}/packages/:US-FED-2026.taxpack.json`);
    expect(res.status).toBe(200);
    const pkg = (await res.json()) as { packageCode: string };
    expect(pkg.packageCode).toBe("US-FED-2026");
  });

  it("tolerates omitted .taxpack.json extension e.g. /packages/US-FED-2026", async () => {
    const res = await fetch(`${baseUrl}/packages/US-FED-2026`);
    expect(res.status).toBe(200);
    const pkg = (await res.json()) as { packageCode: string };
    expect(pkg.packageCode).toBe("US-FED-2026");
  });

  it("returns 404 with friendly hint on non-existent package download", async () => {
    const res = await fetch(`${baseUrl}/packages/NON-EXISTENT.taxpack.json`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string; hint: string };
    expect(body.error).toBe("Package not found");
    expect(body.hint).toBeDefined();
  });
});

