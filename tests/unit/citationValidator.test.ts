import { describe, it, expect } from "vitest";
import { validateVersionCitations } from "../../src/validation/citationValidator.js";
import type { ITaxRuleVersion } from "../../src/domain/types.js";

describe("citationValidator", () => {
  const baseVersion: ITaxRuleVersion = {
    versionCode: "CIT-v1",
    versionNumber: 1,
    status: "DRAFT",
    ruleType: "FLAT_RATE",
    ruleData: { rate: 0.05 },
    effectiveFrom: "2026-01-01T00:00:00.000Z",
    effectiveTo: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "DEV_01",
    citations: [
      {
        authority: "IRS",
        title: "Circular E",
        statuteReference: "26 U.S.C. § 3101",
        sourceUrl: "https://www.irs.gov/p15",
        publicationDate: "2025-12-01",
        citationTier: "TIER_1_OFFICIAL"
      }
    ],
    testCases: []
  };

  it("passes when a TIER_1_OFFICIAL citation is present", () => {
    const res = validateVersionCitations(baseVersion);
    expect(res.isValid).toBe(true);
  });

  it("fails if TIER_1_OFFICIAL citation is missing", () => {
    const tier3Version: ITaxRuleVersion = {
      ...baseVersion,
      citations: [
        {
          ...baseVersion.citations[0],
          citationTier: "TIER_3_THIRD_PARTY"
        }
      ]
    };
    const res = validateVersionCitations(tier3Version);
    expect(res.isValid).toBe(false);
    expect(res.issues[0].code).toBe("MISSING_TIER_1_CITATION");
  });

  it("fails if statuteReference is empty", () => {
    const emptyStatuteVersion: ITaxRuleVersion = {
      ...baseVersion,
      citations: [
        {
          ...baseVersion.citations[0],
          statuteReference: "   "
        }
      ]
    };
    const res = validateVersionCitations(emptyStatuteVersion);
    expect(res.isValid).toBe(false);
    expect(res.issues.some((i) => i.code === "EMPTY_STATUTE_REFERENCE")).toBe(true);
  });
});
