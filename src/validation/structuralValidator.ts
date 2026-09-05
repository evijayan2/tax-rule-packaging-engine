import { taxRulePackageSchema, ruleVersionSchema } from "../domain/schemas.js";
import type { ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";

export interface IValidationIssue {
  path: string;
  message: string;
  code: string;
}

export interface IValidationResult {
  isValid: boolean;
  issues: IValidationIssue[];
}

/**
 * Validates the structural integrity of a complete TaxRulePackage against its Zod schema.
 * @param pkg - The package object to validate.
 * @returns Validation result with structured issue list.
 */
export function validatePackageStructure(pkg: unknown): IValidationResult {
  const parsed = taxRulePackageSchema.safeParse(pkg);
  if (parsed.success) {
    return { isValid: true, issues: [] };
  }

  const issues: IValidationIssue[] = parsed.error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
    code: err.code
  }));

  return { isValid: false, issues };
}

/**
 * Validates the structural integrity of an individual TaxRuleVersion.
 * @param version - The version object to validate.
 * @returns Validation result with structured issue list.
 */
export function validateVersionStructure(version: unknown): IValidationResult {
  const parsed = ruleVersionSchema.safeParse(version);
  if (parsed.success) {
    return { isValid: true, issues: [] };
  }

  const issues: IValidationIssue[] = parsed.error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
    code: err.code
  }));

  return { isValid: false, issues };
}
