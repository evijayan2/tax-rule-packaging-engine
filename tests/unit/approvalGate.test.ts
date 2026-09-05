import { describe, it, expect } from "vitest";
import { evaluateApprovalGate } from "../../src/governance/approvalGate.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";
import { runValidationPipeline } from "../../src/validation/validationPipeline.js";
import { runPackageRegressionTests } from "../../src/testing/regressionRunner.js";

describe("approvalGate", () => {
  const v1 = pennsylvaniaTaxPackage2026.rules[0].versions[0];
  const validReport = runValidationPipeline(pennsylvaniaTaxPackage2026);
  const passRegression = runPackageRegressionTests(pennsylvaniaTaxPackage2026);

  it("permits approval when author is distinct from approver", () => {
    const res = evaluateApprovalGate(v1, validReport, passRegression, {
      approverId: "COMPLIANCE_OFFICER_01"
    });
    expect(res.canApprove).toBe(true);
    expect(res.reasons).toHaveLength(0);
  });

  it("blocks approval if author attempts self-approval without override", () => {
    const res = evaluateApprovalGate(v1, validReport, passRegression, {
      approverId: v1.createdBy // Same as creator
    });
    expect(res.canApprove).toBe(false);
    expect(res.reasons[0]).toContain("Separation of duties violation");
  });

  it("permits self-approval when allowSingleOwnerOverride is enabled", () => {
    const res = evaluateApprovalGate(v1, validReport, passRegression, {
      approverId: v1.createdBy,
      allowSingleOwnerOverride: true
    });
    expect(res.canApprove).toBe(true);
  });

  it("blocks approval if validation failed", () => {
    const failedValidation = { ...validReport, isValid: false, totalIssues: 2 };
    const res = evaluateApprovalGate(v1, failedValidation, passRegression, {
      approverId: "OTHER_USER"
    });
    expect(res.canApprove).toBe(false);
    expect(res.reasons.some((r) => r.includes("Validation failed"))).toBe(true);
  });
});

