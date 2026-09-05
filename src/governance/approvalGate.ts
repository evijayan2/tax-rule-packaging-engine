import type { ITaxRuleVersion } from "../domain/types.js";
import type { IPipelineReport } from "../validation/validationPipeline.js";
import type { IRegressionRunReport } from "../testing/regressionRunner.js";

export interface IApprovalOptions {
  approverId: string;
  allowSingleOwnerOverride?: boolean;
}

export interface IApprovalGateResult {
  canApprove: boolean;
  reasons: string[];
}

/**
 * Validates whether a tax rule version can transition to APPROVED status.
 * Enforces separation of duties and prerequisite test/validation completion.
 * @param version - The version under review.
 * @param validationReport - Multi-tier validation results.
 * @param regressionReport - Regression test execution results.
 * @param options - Approval options containing approver identity.
 * @returns Gate decision with rejection reasons if blocked.
 */
export function evaluateApprovalGate(
  version: ITaxRuleVersion,
  validationReport: IPipelineReport,
  regressionReport: IRegressionRunReport,
  options: IApprovalOptions
): IApprovalGateResult {
  const reasons: string[] = [];

  // Check 1: Validation Pipeline must pass
  if (!validationReport.isValid) {
    reasons.push(`Validation failed with ${validationReport.totalIssues} issue(s).`);
  }

  // Check 2: Regression Suite must have 100% pass rate
  if (!regressionReport.passed) {
    reasons.push(
      `Regression tests failed: ${regressionReport.failCount} of ${regressionReport.totalTests} failed.`
    );
  }

  // Check 3: Separation of Duties (Author != Approver)
  const isSelfApproval = version.createdBy === options.approverId;
  if (isSelfApproval && !options.allowSingleOwnerOverride) {
    reasons.push(
      `Separation of duties violation: Approver '${options.approverId}' cannot be identical to Creator '${version.createdBy}'.`
    );
  }

  return {
    canApprove: reasons.length === 0,
    reasons
  };
}
