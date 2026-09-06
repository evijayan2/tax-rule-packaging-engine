import type { ITaxBracket, ITaxRulePackage } from "../domain/types.js";

const DELAWARE_BRACKETS: ITaxBracket[] = [
  { filingStatus: "SINGLE", bracketSequence: 1, incomeFrom: 0, incomeTo: 2000, baseTax: 0, marginalRate: 0.00 },
  { filingStatus: "SINGLE", bracketSequence: 2, incomeFrom: 2000, incomeTo: 5000, baseTax: 0, marginalRate: 0.022 },
  { filingStatus: "SINGLE", bracketSequence: 3, incomeFrom: 5000, incomeTo: 10000, baseTax: 66, marginalRate: 0.039 },
  { filingStatus: "SINGLE", bracketSequence: 4, incomeFrom: 10000, incomeTo: 20000, baseTax: 261, marginalRate: 0.048 },
  { filingStatus: "SINGLE", bracketSequence: 5, incomeFrom: 20000, incomeTo: 25000, baseTax: 741, marginalRate: 0.052 },
  { filingStatus: "SINGLE", bracketSequence: 6, incomeFrom: 25000, incomeTo: 60000, baseTax: 1001, marginalRate: 0.0555 },
  { filingStatus: "SINGLE", bracketSequence: 7, incomeFrom: 60000, incomeTo: null, baseTax: 2943.5, marginalRate: 0.066 }
];

/**
 * Authoritative 2026 Delaware Statutory Tax Rules Package.
 * Personal Income Tax: Graduated withholding brackets (0% to 6.6%) under 30 Del. C. § 1102.
 * Employer Unemployment Tax: 2.3% entry experience rate under 19 Del. C. § 3345 with $10,500 wage base.
 */
export const delawareTaxPackage2026: ITaxRulePackage = {
  packageCode: "DE-STATE-2026",
  name: "State of Delaware Statutory Tax Rules 2026",
  version: "1.0.0",
  jurisdictionCode: "DE-STATE",
  generatedAt: "2026-01-01T00:00:00.000Z",
  jurisdictions: [
    {
      code: "DE-STATE",
      name: "State of Delaware",
      level: "STATE",
      state: "DE",
      parentJurisdictionCode: "US-FED"
    },
    {
      code: "DE-LOCAL-WILMINGTON",
      name: "City of Wilmington",
      level: "CITY",
      state: "DE",
      parentJurisdictionCode: "DE-STATE"
    }
  ],
  rules: [
    {
      ruleCode: "DE_SIT_BRACKETS",
      name: "Delaware Personal Income Tax Graduated Brackets",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "DE-STATE",
      description: "Delaware state personal income tax graduated progressive brackets (0% up to 6.6%).",
      versions: [
        {
          versionCode: "DE-SIT-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "BRACKET_PERCENTAGE",
          ruleData: {
            brackets: DELAWARE_BRACKETS
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "DE_DIV_OF_REVENUE",
              title: "Delaware Division of Revenue Employer Withholding Guide 2026",
              statuteReference: "30 Del. C. § 1102; 30 Del. C. § 1151",
              sourceUrl: "https://revenue.delaware.gov/withholding-tax-information/",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "Delaware individual personal income tax graduated rates from 0.0% to 6.6% on taxable income exceeding $60,000."
            }
          ],
          testCases: [
            {
              id: "tc-de-pit-01",
              description: "Income in bracket 1 ($1,500) - 0.0% tax",
              inputPayload: { grossWages: 1500, filingStatus: "SINGLE" },
              expectedOutput: { taxAmount: 0.0, taxableWages: 1500 }
            },
            {
              id: "tc-de-pit-02",
              description: "Income in bracket 3 ($7,500) - $66 base + 3.9% over $5,000 ($97.50) = $163.50",
              inputPayload: { grossWages: 7500, filingStatus: "SINGLE" },
              expectedOutput: { taxAmount: 163.5, taxableWages: 7500 }
            },
            {
              id: "tc-de-pit-03",
              description: "Income in top bracket ($70,000) - $2,943.50 base + 6.6% over $60,000 ($660) = $3,603.50",
              inputPayload: { grossWages: 70000, filingStatus: "SINGLE" },
              expectedOutput: { taxAmount: 3603.5, taxableWages: 70000 }
            }
          ]
        }
      ]
    },
    {
      ruleCode: "DE_SUTA_EMPLOYER",
      name: "Delaware SUTA Unemployment Tax Employer Rate",
      category: "EMPLOYER_TAX",
      taxType: "STATE_UNEMPLOYMENT_TAX",
      jurisdictionCode: "DE-STATE",
      description: "Delaware Department of Labor new employer SUTA tax rate (2.3% on $10,500 wage cap).",
      versions: [
        {
          versionCode: "DE-SUTA-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.023,
            wageCap: 10500
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "DE_DEPT_OF_LABOR",
              title: "Delaware Department of Labor UI Tax Rates 2026",
              statuteReference: "19 Del. C. § 3345",
              sourceUrl: "https://labor.delaware.gov/divisions/unemployment-insurance/",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "Standard new employer tax rate for Delaware unemployment insurance is 2.30% with a $10,500 taxable wage base."
            }
          ],
          testCases: [
            {
              id: "tc-de-suta-01",
              description: "Standard wage within $10,500 SUTA cap",
              inputPayload: { grossWages: 5000, priorCumulativeWages: 0 },
              expectedOutput: { taxAmount: 115.0, taxableWages: 5000, effectiveRate: 0.023 }
            },
            {
              id: "tc-de-suta-02",
              description: "Wage reaching $10,500 SUTA cap",
              inputPayload: { grossWages: 5000, priorCumulativeWages: 8000 },
              expectedOutput: { taxAmount: 57.5, taxableWages: 2500, effectiveRate: 0.023 }
            }
          ]
        }
      ]
    },
    {
      ruleCode: "DE_WILMINGTON_EIT",
      name: "City of Wilmington Earned Income Tax Rate",
      category: "WITHHOLDING",
      taxType: "LOCAL_INCOME_TAX",
      jurisdictionCode: "DE-LOCAL-WILMINGTON",
      description: "City of Wilmington local earned income tax flat rate (1.25%).",
      versions: [
        {
          versionCode: "DE-WILMINGTON-EIT-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.0125
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "City of Wilmington Finance Department",
              title: "City of Wilmington Wage Tax Ordinance 2026",
              statuteReference: "Wilmington City Code § 44-31",
              sourceUrl: "https://www.wilmingtonde.gov/government/city-departments/finance",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "City of Wilmington earned income tax rate is 1.25%."
            }
          ],
          testCases: [
            {
              id: "tc-de-wilm-01",
              description: "Wilmington local EIT calculation",
              inputPayload: { grossWages: 1000 },
              expectedOutput: { taxAmount: 12.50, taxableWages: 1000, effectiveRate: 0.0125 }
            }
          ]
        }
      ]
    }
  ]
};

