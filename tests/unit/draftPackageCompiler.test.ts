import { describe, it, expect } from "vitest";
import { compileDraftPackage } from "../../src/ingestion/draftPackageCompiler.js";
import type { IExtractedTaxRule } from "../../src/ingestion/types.js";

describe("draftPackageCompiler", () => {
  it("compiles extracted rule into a valid draft package", () => {
    const extracted: IExtractedTaxRule = {
      ruleCode: "PA_PIT_RATE",
      name: "Pennsylvania Personal Income Tax",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "PA",
      ruleType: "FLAT_RATE",
      rate: 0.0307,
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      citation: {
        authority: "PA_DEPT_OF_REVENUE",
        title: "2026 REV-419",
        statuteReference: "72 P.S. § 7302",
        sourceUrl: "https://example.gov",
        documentHash: "sha256:abc",
        publicationDate: "2025-12-01",
        citationTier: "TIER_1_OFFICIAL",
        excerpt: "3.07% rate"
      }
    };

    const pkg = compileDraftPackage({
      packageCode: "PA-2026-TEST",
      packageName: "PA Test Draft",
      jurisdiction: { code: "PA", name: "Pennsylvania", level: "STATE", state: "PA" },
      extractedRules: [extracted]
    });

    expect(pkg.packageCode).toBe("PA-2026-TEST");
    expect(pkg.rules).toHaveLength(1);
    expect(pkg.rules[0].versions[0].status).toBe("DRAFT");
    expect(pkg.rules[0].versions[0].testCases).toHaveLength(2);
    expect(pkg.rules[0].versions[0].citations[0].documentHash).toBe("sha256:abc");
  });
});
