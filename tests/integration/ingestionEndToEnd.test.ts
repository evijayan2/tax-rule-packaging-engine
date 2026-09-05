import { describe, it, expect } from "vitest";
import { runIngestionPipeline } from "../../src/ingestion/ingestionPipeline.js";
import { runValidationPipeline } from "../../src/validation/validationPipeline.js";
import { runPackageRegressionTests } from "../../src/testing/regressionRunner.js";

describe("Ingestion Pipeline End-to-End Integration", () => {
  it("ingests IRS notice, compiles DRAFT package, passes validation and 100% regression tests", async () => {
    const report = await runIngestionPipeline({
      authorityCode: "IRS",
      taxYear: 2026
    });

    expect(report.success).toBe(true);
    expect(report.authorityCode).toBe("IRS");
    expect(report.rulesExtractedCount).toBe(3);
    expect(report.package).toBeDefined();

    if (!report.package) throw new Error("Package was not generated");

    // Verify all versions are DRAFT (never auto-activated)
    for (const rule of report.package.rules) {
      for (const ver of rule.versions) {
        expect(ver.status).toBe("DRAFT");
        expect(ver.citations[0].citationTier).toBe("TIER_1_OFFICIAL");
        expect(ver.citations[0].documentHash).toBeDefined();
      }
    }

    // Step 2: Validate against structural, date overlap, bounds, and citation rules
    const valReport = runValidationPipeline(report.package);
    expect(valReport.isValid).toBe(true);
    expect(valReport.totalIssues).toBe(0);

    // Step 3: Run the synthesized regression test cases
    const regReport = runPackageRegressionTests(report.package);
    expect(regReport.passed).toBe(true);
    expect(regReport.failCount).toBe(0);
    expect(regReport.totalTests).toBeGreaterThan(0);
  });

  it("ingests PA DOR notice, compiles DRAFT package, passes validation and 100% regression tests", async () => {
    const report = await runIngestionPipeline({
      authorityCode: "PA_DOR",
      taxYear: 2026
    });

    expect(report.success).toBe(true);
    expect(report.authorityCode).toBe("PA_DOR");
    expect(report.rulesExtractedCount).toBe(1);
    expect(report.package).toBeDefined();

    if (!report.package) throw new Error("Package was not generated");

    const paRule = report.package.rules[0];
    expect(paRule.ruleCode).toBe("PA_PIT_RATE");
    expect(paRule.versions[0].ruleData.rate).toBe(0.0307);

    // Validate
    const valReport = runValidationPipeline(report.package);
    expect(valReport.isValid).toBe(true);

    // Regression tests
    const regReport = runPackageRegressionTests(report.package);
    expect(regReport.passed).toBe(true);
  });

  it("fails closed when encountering an unconfigured authority", async () => {
    const report = await runIngestionPipeline({
      authorityCode: "UNSUPPORTED_STATE_XYZ",
      taxYear: 2026
    });

    expect(report.success).toBe(false);
    expect(report.warnings[0]).toContain("No registered authority adapter found");
  });
});

