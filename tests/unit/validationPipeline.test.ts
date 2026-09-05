import { describe, it, expect } from "vitest";
import { runValidationPipeline } from "../../src/validation/validationPipeline.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";

describe("validationPipeline", () => {
  it("validates official federal 2026 package successfully", () => {
    const report = runValidationPipeline(federalTaxPackage2026);
    expect(report.isValid).toBe(true);
    expect(report.totalIssues).toBe(0);
    expect(report.steps.every((s) => s.passed)).toBe(true);
  });

  it("validates official pennsylvania 2026 package successfully", () => {
    const report = runValidationPipeline(pennsylvaniaTaxPackage2026);
    expect(report.isValid).toBe(true);
    expect(report.totalIssues).toBe(0);
    expect(report.steps.every((s) => s.passed)).toBe(true);
  });

  it("aggregates issues from multiple failed steps", () => {
    const brokenPkg = {
      ...pennsylvaniaTaxPackage2026,
      rules: [
        {
          ...pennsylvaniaTaxPackage2026.rules[0],
          versions: [
            {
              ...pennsylvaniaTaxPackage2026.rules[0].versions[0],
              ruleData: { rate: 2.5 }, // bounds issue (> 1.0)
              citations: [] // structural & citation issue
            }
          ]
        }
      ]
    };

    const report = runValidationPipeline(brokenPkg);
    expect(report.isValid).toBe(false);
    expect(report.totalIssues).toBeGreaterThan(0);
  });
});

