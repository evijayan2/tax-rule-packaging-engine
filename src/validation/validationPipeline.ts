import type { ITaxRulePackage } from "../domain/types.js";
import { validatePackageStructure } from "./structuralValidator.js";
import { validatePackageDateRanges } from "./dateOverlapValidator.js";
import { validatePackageBounds } from "./boundsValidator.js";
import { validatePackageCitations } from "./citationValidator.js";
import type { IValidationIssue } from "./structuralValidator.js";

export interface IPipelineStepResult {
  step: string;
  passed: boolean;
  issues: IValidationIssue[];
}

export interface IPipelineReport {
  isValid: boolean;
  totalIssues: number;
  steps: IPipelineStepResult[];
  issues: IValidationIssue[];
  validatedAt: string;
}

/**
 * Runs the full multi-tier validation pipeline on a tax rule package.
 * @param pkg - The package to validate.
 * @returns Comprehensive report detailing structural, date overlap, bounds, and citation checks.
 */
export function runValidationPipeline(pkg: unknown): IPipelineReport {
  const steps: IPipelineStepResult[] = [];
  const allIssues: IValidationIssue[] = [];

  // Step 1: Structural
  const struct = validatePackageStructure(pkg);
  steps.push({ step: "STRUCTURAL", passed: struct.isValid, issues: struct.issues });
  allIssues.push(...struct.issues);

  // Subsequent steps require valid base structure
  if (struct.isValid) {
    const validPkg = pkg as ITaxRulePackage;

    const dates = validatePackageDateRanges(validPkg);
    steps.push({ step: "DATE_OVERLAP", passed: dates.isValid, issues: dates.issues });
    allIssues.push(...dates.issues);

    const bounds = validatePackageBounds(validPkg);
    steps.push({ step: "BOUNDS", passed: bounds.isValid, issues: bounds.issues });
    allIssues.push(...bounds.issues);

    const citations = validatePackageCitations(validPkg);
    steps.push({ step: "CITATIONS", passed: citations.isValid, issues: citations.issues });
    allIssues.push(...citations.issues);
  }

  return {
    isValid: allIssues.length === 0,
    totalIssues: allIssues.length,
    steps,
    issues: allIssues,
    validatedAt: new Date().toISOString()
  };
}

