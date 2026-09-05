import type { ITaxRule, ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";
import type { IValidationIssue, IValidationResult } from "./structuralValidator.js";

/**
 * Determines whether two effective date ranges overlap.
 * Null effectiveTo represents an open-ended/infinite range.
 */
function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Checks if two tax rule versions have overlapping effective date intervals.
 */
function checkVersionPairOverlap(
  ruleCode: string,
  vA: ITaxRuleVersion,
  vB: ITaxRuleVersion
): IValidationIssue | null {
  const startA = new Date(vA.effectiveFrom).getTime();
  const endA = vA.effectiveTo ? new Date(vA.effectiveTo).getTime() : Infinity;
  const startB = new Date(vB.effectiveFrom).getTime();
  const endB = vB.effectiveTo ? new Date(vB.effectiveTo).getTime() : Infinity;

  if (rangesOverlap(startA, endA, startB, endB)) {
    return {
      path: `rules.${ruleCode}.versions`,
      message: `Collision between version ${vA.versionCode} and ${vB.versionCode}: effective date ranges overlap.`,
      code: "DATE_OVERLAP_COLLISION"
    };
  }
  return null;
}

/**
 * Validates that all versions for a single tax rule have contiguous or discrete non-overlapping date ranges.
 * @param rule - The tax rule containing version records.
 * @returns Validation result with any overlap collisions.
 */
export function validateRuleDateRanges(rule: ITaxRule): IValidationResult {
  const issues: IValidationIssue[] = [];
  const versions = rule.versions;

  for (let i = 0; i < versions.length; i++) {
    for (let j = i + 1; j < versions.length; j++) {
      const issue = checkVersionPairOverlap(rule.ruleCode, versions[i], versions[j]);
      if (issue) {
        issues.push(issue);
      }
    }
  }

  return { isValid: issues.length === 0, issues };
}

/**
 * Validates that no rules within a tax rule package have overlapping version date ranges.
 * @param pkg - The tax rule package to validate.
 * @returns Validation result across all package rules.
 */
export function validatePackageDateRanges(pkg: ITaxRulePackage): IValidationResult {
  const issues: IValidationIssue[] = [];

  for (const rule of pkg.rules) {
    const result = validateRuleDateRanges(rule);
    if (!result.isValid) {
      issues.push(...result.issues);
    }
  }

  return { isValid: issues.length === 0, issues };
}
