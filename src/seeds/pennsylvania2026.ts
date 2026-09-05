import type { ITaxRulePackage } from "../domain/types.js";

/**
 * Authoritative 2026 Pennsylvania State Tax Rule Package for Personal Income Tax (PIT).
 * Governed by PA Department of Revenue REV-419 Employer Withholding Guide.
 */
export const pennsylvaniaTaxPackage2026: ITaxRulePackage = {
  packageCode: "PA-STATE-2026",
  name: "Commonwealth of Pennsylvania Statutory Tax Rules 2026",
  version: "1.0.0",
  jurisdictionCode: "PA",
  generatedAt: "2026-01-01T00:00:00.000Z",
  jurisdictions: [
    {
      code: "PA",
      name: "Commonwealth of Pennsylvania",
      level: "STATE",
      state: "PA",
      parentJurisdictionCode: "US-FED"
    }
  ],
  rules: [
    {
      ruleCode: "PA_PIT_RATE",
      name: "Pennsylvania Personal Income Tax (PIT)",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "PA",
      description: "Pennsylvania state personal income tax flat withholding rate of 3.07% applied to all taxable compensation.",
      versions: [
        {
          versionCode: "PA-PIT-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.0307
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "PA_DEPT_OF_REVENUE",
              title: "2026 Pennsylvania Employer Withholding Guide (REV-419)",
              statuteReference: "72 P.S. § 7302; 61 Pa. Code § 101.1",
              sourceUrl: "https://www.revenue.pa.gov/FormsandPublications/FormsforBusinesses/EmployerWithholding/Documents/rev-419.pdf",
              publicationDate: "2025-12-01",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "The Pennsylvania personal income tax rate is 3.07 percent (0.0307). All taxable compensation is subject to withholding at this rate."
            }
          ],
          testCases: [
            {
              id: "tc-pa-pit-01",
              description: "Standard $1,000 bi-weekly wage PIT withholding",
              inputPayload: { grossWages: 1000 },
              expectedOutput: { taxAmount: 30.7, taxableWages: 1000, effectiveRate: 0.0307 }
            },
            {
              id: "tc-pa-pit-02",
              description: "Standard $5,000 monthly wage PIT withholding",
              inputPayload: { grossWages: 5000 },
              expectedOutput: { taxAmount: 153.5, taxableWages: 5000, effectiveRate: 0.0307 }
            }
          ]
        }
      ]
    }
  ]
};

