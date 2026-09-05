import { describe, it, expect } from "vitest";
import { validateRuleDateRanges } from "../../src/validation/dateOverlapValidator.js";
import type { ITaxRule, ITaxRuleVersion } from "../../src/domain/types.js";

describe("dateOverlapValidator", () => {
  const baseVersion: ITaxRuleVersion = {
    versionCode: "TEST-v1",
    versionNumber: 1,
    status: "DRAFT",
    ruleType: "FLAT_RATE",
    ruleData: { rate: 0.05 },
    effectiveFrom: "2026-01-01T00:00:00.000Z",
    effectiveTo: "2026-06-30T23:59:59.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "DEV_01",
    citations: [
      {
        authority: "STATE",
        title: "Test Guidance",
        statuteReference: "Code § 1",
        sourceUrl: "https://example.gov",
        publicationDate: "2025-12-01",
        citationTier: "TIER_1_OFFICIAL"
      }
    ],
    testCases: []
  };

  it("passes when date ranges are strictly disjoint and sequential", () => {
    const v2: ITaxRuleVersion = {
      ...baseVersion,
      versionCode: "TEST-v2",
      versionNumber: 2,
      effectiveFrom: "2026-07-01T00:00:00.000Z",
      effectiveTo: null
    };

    const rule: ITaxRule = {
      ruleCode: "TEST_RULE",
      name: "Test Rule",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "PA",
      versions: [baseVersion, v2]
    };

    const res = validateRuleDateRanges(rule);
    expect(res.isValid).toBe(true);
    expect(res.issues).toHaveLength(0);
  });

  it("fails when date ranges overlap", () => {
    const overlappingV2: ITaxRuleVersion = {
      ...baseVersion,
      versionCode: "TEST-v2",
      versionNumber: 2,
      effectiveFrom: "2026-05-01T00:00:00.000Z",
      effectiveTo: null
    };

    const rule: ITaxRule = {
      ruleCode: "TEST_RULE",
      name: "Test Rule",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "PA",
      versions: [baseVersion, overlappingV2]
    };

    const res = validateRuleDateRanges(rule);
    expect(res.isValid).toBe(false);
    expect(res.issues[0].code).toBe("DATE_OVERLAP_COLLISION");
  });
});

