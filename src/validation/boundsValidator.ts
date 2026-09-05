import type { ITaxBracket, ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";
import type { IValidationIssue, IValidationResult } from "./structuralValidator.js";

/**
 * Validates scalar rate and cap bounds on a rule version.
 */
function validateScalarBounds(
  version: ITaxRuleVersion,
  basePath: string,
  issues: IValidationIssue[]
): void {
  const data = version.ruleData;

  if (typeof data.rate === "number" && (data.rate < 0 || data.rate > 1)) {
    issues.push({
      path: `${basePath}.rate`,
      message: `Rate ${data.rate} is out of bounds; must be between 0.0 and 1.0.`,
      code: "RATE_OUT_OF_BOUNDS"
    });
  }

  if (typeof data.wageCap === "number" && data.wageCap <= 0) {
    issues.push({
      path: `${basePath}.wageCap`,
      message: `Wage cap ${data.wageCap} must be strictly positive.`,
      code: "CAP_NON_POSITIVE"
    });
  }
}

/**
 * Validates ordering and continuity of progressive tax brackets.
 */
function validateBracketSequence(
  brackets: ITaxBracket[],
  basePath: string,
  issues: IValidationIssue[]
): void {
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (b.incomeTo !== null && b.incomeTo !== undefined && b.incomeTo <= b.incomeFrom) {
      issues.push({
        path: `${basePath}.brackets[${i}]`,
        message: `Bracket incomeTo (${b.incomeTo}) must be greater than incomeFrom (${b.incomeFrom}).`,
        code: "INVALID_BRACKET_BOUNDS"
      });
    }

    if (i > 0) {
      const prev = brackets[i - 1];
      if (prev.incomeTo !== null && prev.incomeTo !== undefined && prev.incomeTo !== b.incomeFrom) {
        issues.push({
          path: `${basePath}.brackets[${i}]`,
          message: `Discontinuity between bracket ${i - 1} and ${i}: expected incomeFrom ${prev.incomeTo}, got ${b.incomeFrom}.`,
          code: "BRACKET_DISCONTINUITY"
        });
      }
    }
  }
}

/**
 * Validates mathematical boundaries for a single tax rule version.
 * @param version - The tax rule version to validate.
 * @param path - Optional path prefix for error reporting.
 * @returns Validation result.
 */
export function validateVersionBounds(
  version: ITaxRuleVersion,
  path = "version"
): IValidationResult {
  const issues: IValidationIssue[] = [];
  validateScalarBounds(version, path, issues);

  if (Array.isArray(version.ruleData.brackets)) {
    validateBracketSequence(version.ruleData.brackets, path, issues);
  }

  return { isValid: issues.length === 0, issues };
}

/**
 * Validates mathematical bounds across all rules and versions in a package.
 * @param pkg - The tax rule package to validate.
 * @returns Validation result.
 */
export function validatePackageBounds(pkg: ITaxRulePackage): IValidationResult {
  const issues: IValidationIssue[] = [];

  for (const rule of pkg.rules) {
    for (const v of rule.versions) {
      const path = `rules.${rule.ruleCode}.versions.${v.versionCode}`;
      const res = validateVersionBounds(v, path);
      if (!res.isValid) {
        issues.push(...res.issues);
      }
    }
  }

  return { isValid: issues.length === 0, issues };
}

