import type { ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";
import type { IValidationIssue, IValidationResult } from "./structuralValidator.js";

/**
 * Checks that a version contains at least one Tier 1 official government citation if required.
 */
function checkTier1Citation(
  version: ITaxRuleVersion,
  basePath: string,
  issues: IValidationIssue[]
): void {
  const hasTier1 = version.citations.some((c) => c.citationTier === "TIER_1_OFFICIAL");
  if (!hasTier1) {
    issues.push({
      path: `${basePath}.citations`,
      message: `Version ${version.versionCode} lacks a TIER_1_OFFICIAL authoritative government citation.`,
      code: "MISSING_TIER_1_CITATION"
    });
  }
}

/**
 * Checks that individual citations have valid non-empty fields.
 */
function checkCitationFields(
  version: ITaxRuleVersion,
  basePath: string,
  issues: IValidationIssue[]
): void {
  version.citations.forEach((c, idx) => {
    if (!c.statuteReference || c.statuteReference.trim().length === 0) {
      issues.push({
        path: `${basePath}.citations[${idx}].statuteReference`,
        message: "Statute reference cannot be blank.",
        code: "EMPTY_STATUTE_REFERENCE"
      });
    }
    if (!c.sourceUrl.startsWith("http://") && !c.sourceUrl.startsWith("https://")) {
      issues.push({
        path: `${basePath}.citations[${idx}].sourceUrl`,
        message: "Citation sourceUrl must be a valid HTTP or HTTPS URL.",
        code: "INVALID_CITATION_URL"
      });
    }
  });
}

/**
 * Validates citation completeness for a single tax rule version.
 * @param version - The tax rule version to inspect.
 * @param basePath - Path identifier for error logging.
 * @param requireTier1 - Whether TIER_1_OFFICIAL is mandatory.
 * @returns Validation result.
 */
export function validateVersionCitations(
  version: ITaxRuleVersion,
  basePath = "version",
  requireTier1 = true
): IValidationResult {
  const issues: IValidationIssue[] = [];

  if (requireTier1) {
    checkTier1Citation(version, basePath, issues);
  }
  checkCitationFields(version, basePath, issues);

  return { isValid: issues.length === 0, issues };
}

/**
 * Validates citations across all versions in a tax rule package.
 * @param pkg - The tax rule package to validate.
 * @returns Validation result.
 */
export function validatePackageCitations(pkg: ITaxRulePackage): IValidationResult {
  const issues: IValidationIssue[] = [];

  for (const rule of pkg.rules) {
    for (const v of rule.versions) {
      const path = `rules.${rule.ruleCode}.versions.${v.versionCode}`;
      const res = validateVersionCitations(v, path, true);
      if (!res.isValid) {
        issues.push(...res.issues);
      }
    }
  }

  return { isValid: issues.length === 0, issues };
}
