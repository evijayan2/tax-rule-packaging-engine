import { describe, it, expect } from "vitest";
import { synthesizeTestCases } from "../../src/ingestion/testCaseSynthesizer.js";
import type { IExtractedTaxRule } from "../../src/ingestion/types.js";

describe("testCaseSynthesizer", () => {
  it("synthesizes valid test cases for flat rate rules", () => {
    const rule: IExtractedTaxRule = {
      ruleCode: "TEST_FLAT",
      name: "Flat Rate",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "PA",
      ruleType: "FLAT_RATE",
      rate: 0.03,
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      citation: {
        authority: "PA",
        title: "Test",
        statuteReference: "Code § 1",
        sourceUrl: "https://example.gov",
        documentHash: "sha256:123",
        publicationDate: "2025-12-01",
        citationTier: "TIER_1_OFFICIAL",
        excerpt: "Rate 3%"
      }
    };

    const cases = synthesizeTestCases(rule);
    expect(cases).toHaveLength(2);
    expect(cases[0].inputPayload.grossWages).toBe(1000);
    expect(cases[0].expectedOutput.taxAmount).toBe(30);
  });

  it("synthesizes 3 test cases for capped rules (below, at, and above cap)", () => {
    const rule: IExtractedTaxRule = {
      ruleCode: "TEST_CAPPED",
      name: "Capped Rate",
      category: "WITHHOLDING",
      taxType: "FICA_SOCIAL_SECURITY",
      jurisdictionCode: "US-FED",
      ruleType: "FLAT_RATE",
      rate: 0.062,
      wageCap: 176100,
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      citation: {
        authority: "IRS",
        title: "Test",
        statuteReference: "Code § 1",
        sourceUrl: "https://example.gov",
        documentHash: "sha256:123",
        publicationDate: "2025-12-01",
        citationTier: "TIER_1_OFFICIAL",
        excerpt: "Rate 6.2%"
      }
    };

    const cases = synthesizeTestCases(rule);
    expect(cases).toHaveLength(3);
    // Above cap test
    expect(cases[2].expectedOutput.taxAmount).toBe(0);
    expect(cases[2].expectedOutput.taxableWages).toBe(0);
  });
});
