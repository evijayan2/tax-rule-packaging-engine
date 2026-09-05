import { describe, it, expect } from "vitest";
import {
  computeSha256,
  computeVersionChecksum,
  computePackageChecksum,
  verifyVersionChecksum
} from "../../src/packaging/checksumService.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";

describe("checksumService", () => {
  const version = pennsylvaniaTaxPackage2026.rules[0].versions[0];

  it("computes deterministic sha256 checksums", () => {
    const hash1 = computeVersionChecksum(version);
    const hash2 = computeVersionChecksum(version);
    expect(hash1).toBe(hash2);
    expect(hash1.startsWith("sha256:")).toBe(true);
  });

  it("computes package manifest checksum", () => {
    const pkgHash = computePackageChecksum(pennsylvaniaTaxPackage2026);
    expect(pkgHash.startsWith("sha256:")).toBe(true);
  });

  it("verifies matching checksum correctly", () => {
    const hash = computeVersionChecksum(version);
    const sealedVersion = { ...version, checksum: hash };
    expect(verifyVersionChecksum(sealedVersion)).toBe(true);
  });

  it("fails verification if ruleData has been tampered with", () => {
    const hash = computeVersionChecksum(version);
    const tampered = {
      ...version,
      checksum: hash,
      ruleData: { rate: 0.04 } // Tampered rate
    };
    expect(verifyVersionChecksum(tampered)).toBe(false);
  });
});

