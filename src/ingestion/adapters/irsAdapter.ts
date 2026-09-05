import type { ITaxJurisdiction } from "../../domain/types.js";
import type { IAuthorityAdapter, IExtractedTaxRule, IRawRegulatoryDocument } from "../types.js";

/**
 * Extracts Social Security withholding rate and wage base cap from IRS text.
 */
function extractSocialSecurityRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const capMatch = doc.content.match(/social security wage (?:base|limit).*?\$?([\d,]+)/i);
  const wageCap = capMatch ? Number(capMatch[1].replace(/,/g, "")) : 176100;

  const rateMatch = doc.content.match(/social security tax rate is ([\d.]+)%/i);
  const rate = rateMatch ? Number((Number(rateMatch[1]) / 100).toFixed(6)) : 0.062;

  return {
    ruleCode: "FED_FICA_SS",
    name: "Social Security (OASDI) Employee Withholding",
    category: "WITHHOLDING",
    taxType: "FICA_SOCIAL_SECURITY",
    jurisdictionCode: "US-FED",
    ruleType: "FLAT_RATE",
    rate,
    wageCap,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "IRS",
      title: doc.title,
      statuteReference: "26 U.S. Code § 3101(a)",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Extracted Social Security tax rate ${rate * 100}% with wage cap $${wageCap}.`
    }
  };
}

/**
 * Extracts Medicare Hospital Insurance withholding rate from IRS text.
 */
function extractMedicareRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const rateMatch = doc.content.match(/medicare tax rate is ([\d.]+)%/i);
  const rate = rateMatch ? Number((Number(rateMatch[1]) / 100).toFixed(6)) : 0.0145;

  return {
    ruleCode: "FED_FICA_MEDICARE",
    name: "Medicare Hospital Insurance Employee Withholding",
    category: "WITHHOLDING",
    taxType: "FICA_MEDICARE",
    jurisdictionCode: "US-FED",
    ruleType: "FLAT_RATE",
    rate,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "IRS",
      title: doc.title,
      statuteReference: "26 U.S. Code § 3101(b)",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Extracted Medicare tax rate ${rate * 100}%.`
    }
  };
}

/**
 * Extracts IRS Standard Business Mileage Rate from notice text.
 */
function extractMileageRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const rateMatch = doc.content.match(/standard mileage rate.*?([\d.]+)\s*cents/i);
  const rate = rateMatch ? Number(rateMatch[1]) / 100 : 0.67;

  return {
    ruleCode: "IRS_MILEAGE",
    name: "IRS Standard Business Mileage Rate",
    category: "MILEAGE",
    taxType: "MILEAGE_REIMBURSEMENT",
    jurisdictionCode: "US-FED",
    ruleType: "PER_MILE_RATE",
    rate,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "IRS",
      title: doc.title,
      statuteReference: "Rev. Proc. 2019-46; Notice 2026-08",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Extracted standard mileage rate $${rate}/mile.`
    }
  };
}

export class IrsSourceAdapter implements IAuthorityAdapter {
  public readonly authorityCode = "IRS";
  public readonly authorityName = "Internal Revenue Service";
  public readonly defaultJurisdiction: ITaxJurisdiction = {
    code: "US-FED",
    name: "United States Federal Government",
    level: "FEDERAL",
    state: null
  };

  /**
   * Parses official IRS regulatory bulletin text and extracts federal tax rules.
   */
  public async parseDocument(
    document: IRawRegulatoryDocument,
    taxYear: number
  ): Promise<IExtractedTaxRule[]> {
    return [
      extractSocialSecurityRule(document, taxYear),
      extractMedicareRule(document, taxYear),
      extractMileageRule(document, taxYear)
    ];
  }

  /**
   * Generates a realistic simulated IRS publication bulletin for the given tax year.
   */
  public async fetchSimulatedNotice(taxYear: number): Promise<IRawRegulatoryDocument> {
    const content = `
Official IRS Notice ${taxYear}-01: Social security tax rate is 6.2% for employees.
The social security wage base limit is $176,100 for tax year ${taxYear}.
The Medicare tax rate is 1.45% for employees and employers.
The standard mileage rate for business use of an automobile is 67 cents per mile.
`;
    return {
      authority: "IRS",
      title: `IRS Publication 15 (Circular E) ${taxYear}`,
      sourceUrl: `https://www.irs.gov/publications/p15-${taxYear}`,
      publicationDate: `${taxYear - 1}-12-15`,
      content,
      documentHash: "sha256:simulated_irs_hash_" + taxYear,
      documentType: "TAX_BULLETIN"
    };
  }
}
