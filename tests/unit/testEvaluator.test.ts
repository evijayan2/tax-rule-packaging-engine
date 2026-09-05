import { describe, it, expect } from "vitest";
import { evaluateRuleVersion, roundToCents } from "../../src/testing/testEvaluator.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";
import type { ITaxRuleVersion } from "../../src/domain/types.js";

describe("testEvaluator", () => {
  it("rounds cents half-up accurately", () => {
    expect(roundToCents(10.004)).toBe(10.00);
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(10.006)).toBe(10.01);
  });

  it("calculates flat-rate PA PIT (3.07%)", () => {
    const paVersion = pennsylvaniaTaxPackage2026.rules[0].versions[0];
    const out = evaluateRuleVersion(paVersion, { grossWages: 2000 });
    expect(out.taxAmount).toBe(61.4);
    expect(out.taxableWages).toBe(2000);
  });

  it("calculates Social Security flat rate with wage cap cutoff", () => {
    const ssVersion = federalTaxPackage2026.rules[0].versions[0]; // cap 176,100
    // Within cap
    const normal = evaluateRuleVersion(ssVersion, { grossWages: 3000, priorCumulativeWages: 50000 });
    expect(normal.taxAmount).toBe(186.0); // 3000 * 0.062

    // Reaching cap
    const atCap = evaluateRuleVersion(ssVersion, { grossWages: 5000, priorCumulativeWages: 174000 });
    expect(atCap.taxableWages).toBe(2100);
    expect(atCap.taxAmount).toBe(130.2); // 2100 * 0.062

    // Beyond cap
    const pastCap = evaluateRuleVersion(ssVersion, { grossWages: 5000, priorCumulativeWages: 180000 });
    expect(pastCap.taxableWages).toBe(0);
    expect(pastCap.taxAmount).toBe(0.0);
  });

  it("calculates progressive brackets accurately", () => {
    const bracketVersion: ITaxRuleVersion = {
      versionCode: "TEST-BRACKET-v1",
      versionNumber: 1,
      status: "DRAFT",
      ruleType: "BRACKET_PERCENTAGE",
      ruleData: {
        brackets: [
          { filingStatus: "SINGLE", bracketSequence: 1, incomeFrom: 0, incomeTo: 10000, baseTax: 0, marginalRate: 0.10 },
          { filingStatus: "SINGLE", bracketSequence: 2, incomeFrom: 10000, incomeTo: 50000, baseTax: 1000, marginalRate: 0.20 }
        ]
      },
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      effectiveTo: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      createdBy: "TEST",
      citations: [],
      testCases: []
    };

    const res = evaluateRuleVersion(bracketVersion, { grossWages: 25000, filingStatus: "SINGLE" });
    // Bracket 1: 0 to 10000 -> 1000 base
    // Bracket 2: (25000 - 10000) * 0.20 = 3000 -> total 4000
    expect(res.taxAmount).toBe(4000);
  });

  it("calculates standard mileage", () => {
    const mileageVersion = federalTaxPackage2026.rules[2].versions[0];
    const res = evaluateRuleVersion(mileageVersion, { miles: 250 });
    expect(res.reimbursementAmount).toBe(167.5); // 250 * 0.67
  });
});

