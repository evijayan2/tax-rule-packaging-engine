import { describe, it, expect } from "vitest";
import { runPackageRegressionTests, runVersionRegressionTests } from "../../src/testing/regressionRunner.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";
import type { ITaxRuleVersion } from "../../src/domain/types.js";

describe("regressionRunner", () => {
  it("passes 100% of federal 2026 bundled regression tests", () => {
    const report = runPackageRegressionTests(federalTaxPackage2026);
    expect(report.passed).toBe(true);
    expect(report.failCount).toBe(0);
    expect(report.passCount).toBe(7); // 3 SS + 2 Med + 1 FIT + 1 Mileage
    expect(report.totalTests).toBe(7);
  });

  it("passes 100% of pennsylvania 2026 bundled regression tests", () => {
    const report = runPackageRegressionTests(pennsylvaniaTaxPackage2026);
    expect(report.passed).toBe(true);
    expect(report.failCount).toBe(0);
    expect(report.passCount).toBe(3);
  });

  it("detects failing regression test case", () => {
    const v: ITaxRuleVersion = {
      ...pennsylvaniaTaxPackage2026.rules[0].versions[0],
      testCases: [
        {
          id: "tc-fail",
          description: "Intentional failing test",
          inputPayload: { grossWages: 1000 },
          expectedOutput: { taxAmount: 999.99 } // Mismatch
        }
      ]
    };

    const rep = runVersionRegressionTests(v);
    expect(rep.passed).toBe(false);
    expect(rep.failCount).toBe(1);
    expect(rep.results[0].failureReason).toContain("Mismatch");
  });
});

