import { createHash } from "node:crypto";
import type { ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";
import { stringifyCanonicalJson } from "./canonicalJson.js";

/**
 * Computes a SHA-256 hash string for an arbitrary input string.
 * @param content - Text content to hash.
 * @returns Hash string prefixed with sha256:
 */
export function computeSha256(content: string): string {
  const hash = createHash("sha256").update(content, "utf8").digest("hex");
  return `sha256:${hash}`;
}

/**
 * Computes a cryptographic checksum for a TaxRuleVersion's core regulatory definition.
 * Excludes mutable operational fields like approvedBy/approvedAt so canonical hash is immutable.
 * @param version - The tax rule version.
 * @returns Canonical SHA-256 checksum string.
 */
export function computeVersionChecksum(version: ITaxRuleVersion): string {
  const canonicalPayload = {
    versionCode: version.versionCode,
    versionNumber: version.versionNumber,
    ruleType: version.ruleType,
    ruleData: version.ruleData,
    effectiveFrom: version.effectiveFrom,
    effectiveTo: version.effectiveTo ?? null,
    citations: version.citations
  };

  const serialized = stringifyCanonicalJson(canonicalPayload);
  return computeSha256(serialized);
}

/**
 * Computes a composite manifest checksum for an entire TaxRulePackage.
 * @param pkg - The package object.
 * @returns Canonical SHA-256 checksum string.
 */
export function computePackageChecksum(pkg: ITaxRulePackage): string {
  const canonicalPayload = {
    packageCode: pkg.packageCode,
    version: pkg.version,
    jurisdictionCode: pkg.jurisdictionCode,
    jurisdictions: pkg.jurisdictions,
    rules: pkg.rules.map((r) => ({
      ruleCode: r.ruleCode,
      taxType: r.taxType,
      category: r.category,
      jurisdictionCode: r.jurisdictionCode,
      versions: r.versions.map((v) => ({
        versionCode: v.versionCode,
        checksum: v.checksum ?? computeVersionChecksum(v)
      }))
    }))
  };

  const serialized = stringifyCanonicalJson(canonicalPayload);
  return computeSha256(serialized);
}

/**
 * Verifies that a rule version matches its assigned checksum.
 * @param version - The version to verify.
 * @returns True if valid, false if tampered or mismatched.
 */
export function verifyVersionChecksum(version: ITaxRuleVersion): boolean {
  if (!version.checksum) return false;
  const expected = computeVersionChecksum(version);
  return version.checksum === expected;
}
