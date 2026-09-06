import type { ITaxBracket, ITaxRulePackage } from "../domain/types.js";

const OHIO_BRACKETS: ITaxBracket[] = [
  { filingStatus: "SINGLE", bracketSequence: 1, incomeFrom: 0, incomeTo: 26050, baseTax: 0, marginalRate: 0.00 },
  { filingStatus: "SINGLE", bracketSequence: 2, incomeFrom: 26050, incomeTo: 100000, baseTax: 0, marginalRate: 0.0275 },
  { filingStatus: "SINGLE", bracketSequence: 3, incomeFrom: 100000, incomeTo: null, baseTax: 2033.63, marginalRate: 0.0375 }
];

export const ohioTaxPackage2026: ITaxRulePackage = {
  packageCode: "OH-STATE-2026",
  name: "State of Ohio Statutory Tax Rules 2026",
  version: "1.0.0",
  jurisdictionCode: "OH",
  generatedAt: "2026-01-01T00:00:00.000Z",
  jurisdictions: [
    {
      code: "OH-STATE",
      name: "State of Ohio",
      level: "STATE",
      state: "OH",
      parentJurisdictionCode: "US-FED"
    }
  ],
  rules: [
    {
      ruleCode: "OH_SIT_BRACKETS",
      name: "OH Personal Income Tax Withholding Brackets",
      category: "WITHHOLDING",
      taxType: "STATE_INCOME_TAX",
      jurisdictionCode: "OH-STATE",
      description: "Ohio state individual income tax graduated withholding brackets (0% up to 3.75%).",
      versions: [
        {
          versionCode: "OH-SIT-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "BRACKET_PERCENTAGE",
          ruleData: {
            brackets: OHIO_BRACKETS
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "Ohio Department of Taxation",
              title: "Ohio Department of Taxation Employer Withholding Tables 2026",
              statuteReference: "O.R.C. § 5747.02",
              sourceUrl: "https://tax.ohio.gov/individual/resources/employer-withholding",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "Ohio state individual income tax graduated withholding brackets."
            }
          ],
          testCases: [
            {
              id: "tc-oh-pit-01",
              description: "Income under $26,050 - 0%",
              inputPayload: { grossWages: 20000, filingStatus: "SINGLE" },
              expectedOutput: { taxAmount: 0.0, taxableWages: 20000 }
            }
          ]
        }
      ]
    },
    {
      ruleCode: "OH_SUTA_EMPLOYER",
      name: "OH Employer Unemployment Tax Rate",
      category: "EMPLOYER_TAX",
      taxType: "STATE_UNEMPLOYMENT_TAX",
      jurisdictionCode: "OH-STATE",
      description: "Ohio Unemployment Tax standard new employer rate (2.7% on $9,000 wage cap).",
      versions: [
        {
          versionCode: "OH-SUTA-2026-v1",
          versionNumber: 1,
          status: "DRAFT",
          ruleType: "FLAT_RATE",
          ruleData: {
            rate: 0.027,
            wageCap: 9000
          },
          effectiveFrom: "2026-01-01T00:00:00.000Z",
          effectiveTo: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdBy: "SYSTEM_GOV_INGESTION",
          citations: [
            {
              authority: "Ohio Dept of Job & Family Services",
              title: "Ohio Dept of Job & Family Services Unemployment Tax Rates 2026",
              statuteReference: "O.R.C. § 4141.25",
              sourceUrl: "https://jfs.ohio.gov/ouio/emp_tax_info.stm",
              publicationDate: "2025-12-15",
              citationTier: "TIER_1_OFFICIAL",
              excerpt: "Ohio Unemployment Tax standard new employer rate is 2.7%."
            }
          ],
          testCases: [
            {
              id: "tc-oh-suta-01",
              description: "Standard wage within cap",
              inputPayload: { grossWages: 5000, priorCumulativeWages: 0 },
              expectedOutput: { taxAmount: 135.0, taxableWages: 5000, effectiveRate: 0.027 }
            }
          ]
        }
      ]
    }
  ]
};
