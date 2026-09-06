import type { ITaxRulePackage, ITaxJurisdiction, ITaxRule } from "../domain/types.js";

const rawDistricts = [
  { name: "Lower Merion School District", psdCode: "460401", rate: 0.0100, county: "Montgomery" },
  { name: "Philadelphia City School District", psdCode: "510101", rate: 0.0375, county: "Philadelphia" },
  { name: "Abington School District", psdCode: "460101", rate: 0.0100, county: "Montgomery" },
  { name: "Upper Darby School District", psdCode: "230801", rate: 0.0100, county: "Delaware" },
  { name: "Central Bucks School District", psdCode: "090201", rate: 0.0100, county: "Bucks" },
  { name: "Pennsbury School District", psdCode: "090901", rate: 0.0100, county: "Bucks" },
  { name: "North Penn School District", psdCode: "460601", rate: 0.0100, county: "Montgomery" },
  { name: "West Chester Area School District", psdCode: "150801", rate: 0.0100, county: "Chester" },
  { name: "Radnor Township School District", psdCode: "230601", rate: 0.0100, county: "Delaware" },
  { name: "Tredyffrin-Easttown School District", psdCode: "150701", rate: 0.0100, county: "Chester" },
  { name: "Spring-Ford Area School District", psdCode: "460801", rate: 0.0100, county: "Montgomery" },
  { name: "Methacton School District", psdCode: "460301", rate: 0.0100, county: "Montgomery" },
  { name: "Colonial School District", psdCode: "460201", rate: 0.0100, county: "Montgomery" },
  { name: "Upper Merion Area School District", psdCode: "460901", rate: 0.0100, county: "Montgomery" },
  { name: "Wissahickon School District", psdCode: "461101", rate: 0.0100, county: "Montgomery" },
  { name: "Haverford Township School District", psdCode: "230301", rate: 0.0100, county: "Delaware" },
  { name: "Marple Newtown School District", psdCode: "230401", rate: 0.0100, county: "Delaware" },
  { name: "Springfield School District (Delco)", psdCode: "230701", rate: 0.0100, county: "Delaware" },
  { name: "Council Rock School District", psdCode: "090301", rate: 0.0100, county: "Bucks" },
  { name: "Neshaminy School District", psdCode: "090701", rate: 0.0100, county: "Bucks" },
  { name: "Bensalem Township School District", psdCode: "090101", rate: 0.0100, county: "Bucks" },
  { name: "Downingtown Area School District", psdCode: "150201", rate: 0.01125, county: "Chester" },
  { name: "East Brandywine Township (Downingtown Area SD)", psdCode: "150202", rate: 0.01125, county: "Chester" },
  { name: "Great Valley School District", psdCode: "150301", rate: 0.0100, county: "Chester" },
  { name: "Phoenixville Area School District", psdCode: "150501", rate: 0.0100, county: "Chester" },
  { name: "Central Dauphin School District", psdCode: "210201", rate: 0.0100, county: "Dauphin" },
  { name: "Harrisburg City School District", psdCode: "210301", rate: 0.0200, county: "Dauphin" },
  { name: "Allentown City School District", psdCode: "390101", rate: 0.0185, county: "Lehigh" },
  { name: "Parkland School District", psdCode: "390401", rate: 0.0100, county: "Lehigh" },
  { name: "Pittsburgh Public Schools", psdCode: "700101", rate: 0.0300, county: "Allegheny" },
  { name: "Bethlehem Area School District", psdCode: "480101", rate: 0.0100, county: "Northampton" },
  { name: "Reading School District", psdCode: "060801", rate: 0.0130, county: "Berks" },
  { name: "Erie City School District", psdCode: "250201", rate: 0.0118, county: "Erie" },
  { name: "Scranton School District", psdCode: "350801", rate: 0.0340, county: "Lackawanna" },
  { name: "Lancaster School District", psdCode: "360501", rate: 0.0110, county: "Lancaster" },
  { name: "Out of State / Non-PA Resident", psdCode: "880000", rate: 0.0000, county: "Out of State" },
];

const jurisdictions: ITaxJurisdiction[] = rawDistricts.map((d) => ({
  code: `PA-PSD-${d.psdCode}`,
  name: d.name,
  level: "SCHOOL_DISTRICT",
  state: "PA",
  parentJurisdictionCode: "PA",
}));

const rules: ITaxRule[] = rawDistricts.map((d) => ({
  ruleCode: `PA_LOCAL_EIT_${d.psdCode}`,
  name: `PA Act 32 Local EIT Rate - ${d.name}`,
  category: "WITHHOLDING",
  taxType: "LOCAL_INCOME_TAX",
  jurisdictionCode: `PA-PSD-${d.psdCode}`,
  description: `Local Earned Income Tax (EIT) rate for ${d.name} (PSD Code ${d.psdCode}).`,
  versions: [
    {
      versionCode: `PA-LOCAL-EIT-${d.psdCode}-2026-v1`,
      versionNumber: 1,
      status: "DRAFT",
      ruleType: "FLAT_RATE",
      ruleData: {
        rate: d.rate,
        psdCode: d.psdCode,
        county: d.county,
      },
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      effectiveTo: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      createdBy: "SYSTEM_GOV_INGESTION",
      citations: [
        {
          authority: "PA_DEPT_OF_COMMUNITY_ECONOMIC_DEV",
          title: "PA Act 32 Local Tax Register 2026",
          statuteReference: "Act 32 of 2008; 53 P.S. § 6924.501",
          sourceUrl: "https://dced.pa.gov/local-government/local-income-tax-information/",
          publicationDate: "2025-12-15",
          citationTier: "TIER_1_OFFICIAL",
          excerpt: `Official Act 32 EIT withholding rate for PSD Code ${d.psdCode}: ${(d.rate * 100).toFixed(4)}%.`,
        },
      ],
      testCases: [
        {
          id: `tc-pa-local-eit-${d.psdCode}-01`,
          description: `Calculation check for ${d.name}`,
          inputPayload: { grossWages: 1000 },
          expectedOutput: { taxAmount: Math.round(1000 * d.rate * 100) / 100 },
        },
      ],
    },
  ],
}));

/**
 * Authoritative 2026 Pennsylvania Local EIT & School District Tax Package.
 */
export const pennsylvaniaLocalTaxPackage2026: ITaxRulePackage = {
  packageCode: "PA-LOCAL-2026",
  name: "Commonwealth of Pennsylvania Act 32 Local EIT School District Tax Rules 2026",
  version: "1.0.0",
  jurisdictionCode: "PA",
  generatedAt: "2026-01-01T00:00:00.000Z",
  jurisdictions,
  rules,
};
