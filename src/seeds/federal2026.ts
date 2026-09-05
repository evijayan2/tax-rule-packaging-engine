import type { ITaxRulePackage } from "../domain/types.js";

/**
 * Authoritative 2026 Federal Tax Rule Package for Social Security, Medicare, and Standard Mileage.
 * Governed by IRS Publication 15 (Circular E) and IRS Notice 2026-08.
 */
export const federalTaxPackage2026: ITaxRulePackage = {
  packageCode: "US-FED-2026",
  name: "United States Federal Statutory Tax Rules 2026",
  version: "1.0.0",
  jurisdictionCode: "US-FED",
  generatedAt: "2026-01-01T00:00:00.000Z",
  jurisdictions: [
    {
      code: "US-FED",
      name: "United States Federal Government",
      level: "FEDERAL",
      state: null
    }
  ],
  rules: [
    {
      ruleCode: "FED_FICA_SS",
      name: "Social Security (OASDI) Employee Withholding",
      category: "WITHHOLDING",
      taxType: "FICA_SOCIAL_SECURITY",
      jurisdictionCode: "US-FED",
      description: "Federal Old-Age, Survivors, and Disability Insurance employee withholding rate of 6.2% up to annual wage cap.",
      versions: [
        {
          versionCode: "FED-FICA-SS-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.062,
            wageCap: 176100
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "IRS",
              title: "IRS Publication 15 (Circular E) 2026",
              statuteReference: "26 U.S. Code § 3101(a)",
              sourceUrl: "https://www.irs.gov/publications/p15",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "The 2026 social security tax rate is 6.2% for the employee. The social security wage base limit is $176,100."
            }
          ],
          testCases: [
            {
              id: "tc-fed-ss-01",
              description: "Standard monthly wage below cap",
              inputPayload: { grossWages: 5000, priorCumulativeWages: 0 },
              expectedOutput: { taxAmount: 310.0, taxableWages: 5000, effectiveRate: 0.062 }
            },
            {
              id: "tc-fed-ss-02",
              description: "Partial wage cap threshold reach",
              inputPayload: { grossWages: 10000, priorCumulativeWages: 170000 },
              expectedOutput: { taxAmount: 378.2, taxableWages: 6100, effectiveRate: 0.062 }
            },
            {
              id: "tc-fed-ss-03",
              description: "Prior cumulative wages strictly exceeds wage cap",
              inputPayload: { grossWages: 5000, priorCumulativeWages: 180000 },
              expectedOutput: { taxAmount: 0.0, taxableWages: 0, effectiveRate: 0.062 }
            }
          ]
        }
      ]
    },
    {
      ruleCode: "FED_FICA_MEDICARE",
      name: "Medicare Hospital Insurance Employee Withholding",
      category: "WITHHOLDING",
      taxType: "FICA_MEDICARE",
      jurisdictionCode: "US-FED",
      description: "Federal Medicare Hospital Insurance employee withholding rate of 1.45% on all earnings.",
      versions: [
        {
          versionCode: "FED-FICA-MED-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.0145
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "IRS",
              title: "IRS Publication 15 (Circular E) 2026",
              statuteReference: "26 U.S. Code § 3101(b)",
              sourceUrl: "https://www.irs.gov/publications/p15",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "The Medicare tax rate is 1.45% each for the employee and employer, unchanged for 2026."
            }
          ],
          testCases: [
            {
              id: "tc-fed-med-01",
              description: "Standard monthly Medicare withholding",
              inputPayload: { grossWages: 5000 },
              expectedOutput: { taxAmount: 72.5, taxableWages: 5000, effectiveRate: 0.0145 }
            },
            {
              id: "tc-fed-med-02",
              description: "Higher wage Medicare withholding",
              inputPayload: { grossWages: 10000 },
              expectedOutput: { taxAmount: 145.0, taxableWages: 10000, effectiveRate: 0.0145 }
            }
          ]
        }
      ]
    },
    {
      ruleCode: "IRS_MILEAGE",
      name: "IRS Standard Business Mileage Rate",
      category: "MILEAGE",
      taxType: "MILEAGE_REIMBURSEMENT",
      jurisdictionCode: "US-FED",
      description: "IRS standard mileage rate for business use of a vehicle (67 cents per mile).",
      versions: [
        {
          versionCode: "IRS-MILEAGE-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "PER_MILE_RATE",
          ruleData: {
            rate: 0.67
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "IRS",
              title: "IRS Notice 2026-08 Standard Mileage Rates",
              statuteReference: "Rev. Proc. 2019-46; IRS Notice 2026-08",
              sourceUrl: "https://www.irs.gov/newsroom/standard-mileage-rates",
              publicationDate: "2025-12-20",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "The standard mileage rate for business use of a van, pickup or panel truck will be 67 cents per mile."
            }
          ],
          testCases: [
            {
              id: "tc-fed-mileage-01",
              description: "100 business miles calculation",
              inputPayload: { miles: 100 },
              expectedOutput: { reimbursementAmount: 67.0, miles: 100, ratePerMile: 0.67 }
            }
          ]
        }
      ]
    }
  ]
};
