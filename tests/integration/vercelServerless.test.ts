import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import handler from "../../api/index.js";
import defaultHandler, { getDefaultPackagesDir } from "../../src/server/server.js";

describe("Vercel Serverless Function Handler", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    // Wrap handler into standard HTTP server to simulate Vercel Serverless environment
    server = createServer((req, res) => {
      handler(req, res);
    });

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

  it("exports a valid request handler function", () => {
    expect(typeof handler).toBe("function");
    expect(typeof defaultHandler).toBe("function");
  });

  it("responds with 200 OK on GET /health in serverless context", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { status: string; service: string };
    expect(body.status).toBe("ok");
    expect(body.service).toBe("tax-rule-package-server");
  });

  it("returns catalog on GET /packages in serverless context", async () => {
    const res = await fetch(`${baseUrl}/packages`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { packages: unknown[]; count: number };
    expect(body.count).toBeGreaterThanOrEqual(4);
    expect(Array.isArray(body.packages)).toBe(true);
  });

  it("serves sealed tax package downloads on GET /packages/:fileName", async () => {
    const res = await fetch(`${baseUrl}/packages/US-FED-2026.taxpack.json`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");

    const pkg = (await res.json()) as { packageCode: string; jurisdictionCode: string };
    expect(pkg.packageCode).toBe("US-FED-2026");
    expect(pkg.jurisdictionCode).toBe("US-FED");
  });

  it("returns 404 JSON for non-existent package", async () => {
    const res = await fetch(`${baseUrl}/packages/NONEXISTENT.taxpack.json`);
    expect(res.status).toBe(404);

    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Package not found");
  });

  it("resolves packages directory respecting PACKAGES_DIR environment variable", () => {
    const defaultDir = getDefaultPackagesDir();
    expect(defaultDir).toBeDefined();

    process.env.PACKAGES_DIR = defaultDir;
    expect(getDefaultPackagesDir()).toBe(defaultDir);
    delete process.env.PACKAGES_DIR;
  });
});
