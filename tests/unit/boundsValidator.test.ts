import { describe, it, expect } from "vitest";
import { validateVersionBounds } from "../../src/validation/boundsValidator.js";
import type { ITaxRuleVersion } from "../../src/domain/types.js";

describe("boundsValidator", () => {
  const validVersion: ITaxRuleVersion = {
    versionCode: "BOUNDS-v1",
    versionNumber: 1,
    status: "DRAFT",
    ruleType: "FLAT_RATE",
    ruleData: { rate: 0.0307, wageCap: 150000 },
    effectiveFrom: "2026-01-01T00:00:00.000Z",
    effectiveTo: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "DEV_01",
    citations: [],
    testCases: []
  };

  it("passes for valid rate and positive wage cap", () => {
    const res = validateVersionBounds(validVersion);
    expect(res.isValid).toBe(true);
  });

  it("detects rate greater than 1.0", () => {
    const invalidVersion = {
      ...validVersion,
      ruleData: { rate: 1.5 }
    };
    const res = validateVersionBounds(invalidVersion);
    expect(res.isValid).toBe(false);
    expect(res.issues[0].code).toBe("RATE_OUT_OF_BOUNDS");
  });

  it("detects negative wage cap", () => {
    const invalidVersion = {
      ...validVersion,
      ruleData: { rate: 0.05, wageCap: -100 }
    };
    const res = validateVersionBounds(invalidVersion);
    expect(res.isValid).toBe(false);
    expect(res.issues[0].code).toBe("CAP_NON_POSITIVE");
  });

  it("detects bracket discontinuity", () => {
    const invalidVersion: ITaxRuleVersion = {
      ...validVersion,
      ruleType: "BRACKET_PERCENTAGE",
      ruleData: {
        brackets: [
          { filingStatus: "SINGLE", bracketSequence: 1, incomeFrom: 0, incomeTo: 10000, baseTax: 0, marginalRate: 0.1 },
          { filingStatus: "SINGLE", bracketSequence: 2, incomeFrom: 12000, incomeTo: null, baseTax: 1000, marginalRate: 0.2 }
        ]
      }
    };
    const res = validateVersionBounds(invalidVersion);
    expect(res.isValid).toBe(false);
    expect(res.issues.some((i) => i.code === "BRACKET_DISCONTINUITY")).toBe(true);
  });
});

