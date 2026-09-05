import type { ITaxJurisdiction } from "../../domain/types.js";
import type { IAuthorityAdapter, IExtractedTaxRule, IRawRegulatoryDocument } from "../types.js";

/**
 * Extracts Texas 0% personal income tax rule governed by the Texas Constitution.
 */
function extractTexasPitRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  return {
    ruleCode: "TX_SIT_RATE",
    name: "Texas Personal Income Tax (No State PIT)",
    category: "WITHHOLDING",
    taxType: "STATE_INCOME_TAX",
    jurisdictionCode: "TX",
    ruleType: "FLAT_RATE",
    rate: 0.0,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "TX_COMPTROLLER",
      title: doc.title,
      statuteReference: "Tex. Const. art. VIII, § 24-a",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: "Texas constitutional prohibition on the imposition of an individual state income tax (0.00%)."
    }
  };
}

/**
 * Extracts Texas Workforce Commission Unemployment Tax (SUTA) employer rate and wage cap.
 */
function extractTexasSutaRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const capMatch = doc.content.match(/suta wage (?:base|cap).*?\$?([\d,]+)/i);
  const wageCap = capMatch ? Number(capMatch[1].replace(/,/g, "")) : 9000;

  const rateMatch = doc.content.match(/twc entry rate is ([\d.]+)%/i);
  const rate = rateMatch ? Number((Number(rateMatch[1]) / 100).toFixed(6)) : 0.027;

  return {
    ruleCode: "TX_SUTA_EMPLOYER",
    name: "Texas Unemployment Tax Employer Rate",
    category: "EMPLOYER_TAX",
    taxType: "STATE_UNEMPLOYMENT_TAX",
    jurisdictionCode: "TX",
    ruleType: "FLAT_RATE",
    rate,
    wageCap,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "TEXAS_WORKFORCE_COMMISSION",
      title: "Texas Workforce Commission Employer Tax Guide",
      statuteReference: "Tex. Lab. Code § 204.006",
      sourceUrl: "https://www.twc.texas.gov/businesses/unemployment-tax-rates",
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Texas Workforce Commission entry employer tax rate of ${rate * 100}% on wage base $${wageCap}.`
    }
  };
}

export class TexasSourceAdapter implements IAuthorityAdapter {
  public readonly authorityCode = "TX_COMPTROLLER";
  public readonly authorityName = "Texas Comptroller of Public Accounts";
  public readonly defaultJurisdiction: ITaxJurisdiction = {
    code: "TX",
    name: "State of Texas",
    level: "STATE",
    state: "TX",
    parentJurisdictionCode: "US-FED"
  };

  /**
   * Parses official Texas regulatory bulletin text and extracts Texas state tax rules.
   */
  public async parseDocument(
    document: IRawRegulatoryDocument,
    taxYear: number
  ): Promise<IExtractedTaxRule[]> {
    return [
      extractTexasPitRule(document, taxYear),
      extractTexasSutaRule(document, taxYear)
    ];
  }

  /**
   * Generates a realistic simulated Texas regulatory bulletin for the given tax year.
   */
  public async fetchSimulatedNotice(taxYear: number): Promise<IRawRegulatoryDocument> {
    const content = `
State of Texas Official Notice Tax Year ${taxYear}:
Pursuant to Texas Constitution Article 8 Section 24-a, there is no personal income tax in Texas.
Texas Workforce Commission (TWC) standard entry rate is 2.7% for new employers.
The SUTA wage base limit is $9,000 for tax year ${taxYear}.
`;
    return {
      authority: "TX_COMPTROLLER",
      title: `Texas Statutory Tax Notice ${taxYear}`,
      sourceUrl: `https://comptroller.texas.gov/taxes/guidance-${taxYear}`,
      publicationDate: `${taxYear - 1}-12-10`,
      content,
      documentHash: "sha256:simulated_tx_hash_" + taxYear,
      documentType: "CONSTITUTIONAL_PROVISION"
    };
  }
}

