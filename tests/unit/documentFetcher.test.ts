import { describe, it, expect } from "vitest";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createRegulatoryDocument,
  loadLocalRegulatoryDocument
} from "../../src/ingestion/documentFetcher.js";

describe("documentFetcher", () => {
  it("creates in-memory regulatory document with SHA-256 hash", () => {
    const doc = createRegulatoryDocument(
      "IRS",
      "Test Notice 2026",
      "https://example.gov",
      "2026-01-01",
      "The tax rate is 6.2%."
    );

    expect(doc.authority).toBe("IRS");
    expect(doc.documentHash.startsWith("sha256:")).toBe(true);
    expect(doc.content).toContain("6.2%");
  });

  it("loads local file and calculates correct document hash", () => {
    const tempFile = join(tmpdir(), `test-regulatory-notice-${Date.now()}.txt`);
    writeFileSync(tempFile, "Official State Bulletin Content", "utf8");

    try {
      const doc = loadLocalRegulatoryDocument({
        filePath: tempFile,
        authority: "STATE",
        title: "Official State Bulletin",
        sourceUrl: "https://state.gov/bulletin",
        publicationDate: "2026-01-01"
      });

      expect(doc.content).toBe("Official State Bulletin Content");
      expect(doc.documentHash.startsWith("sha256:")).toBe(true);
    } finally {
      unlinkSync(tempFile);
    }
  });
});
