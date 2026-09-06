import type { ITaxBracket, ITaxJurisdiction } from "../../domain/types.js";
import type { IAuthorityAdapter, IExtractedTaxRule, IRawRegulatoryDocument } from "../types.js";

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
 * Extracts Delaware progressive personal income tax brackets from notice text.
 */
function extractDelawarePitRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  return {
    ruleCode: "DE_SIT_BRACKETS",
    name: "Delaware Personal Income Tax Graduated Brackets",
    category: "WITHHOLDING",
    taxType: "STATE_INCOME_TAX",
    jurisdictionCode: "DE",
    ruleType: "BRACKET_PERCENTAGE",
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "DE_DIV_OF_REVENUE",
      title: doc.title,
      statuteReference: "30 Del. C. § 1102; 30 Del. C. § 1151",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: "Delaware personal income tax graduated rates ranging from 0.0% to 6.6%."
    },
    additionalParameters: {
      brackets: DELAWARE_BRACKETS
    }
  };
}

/**
 * Extracts Delaware Department of Labor SUTA employer rate and wage cap.
 */
function extractDelawareSutaRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const capMatch = doc.content.match(/suta wage (?:base|cap).*?\$?([\d,]+)/i);
  if (!capMatch) {
    throw new Error(`Failed to extract Delaware SUTA wage cap from document [${doc.title}]. Regex pattern match failed.`);
  }
  const wageCap = Number(capMatch[1].replace(/,/g, ""));

  const rateMatch = doc.content.match(/new employer suta rate is ([\d.]+)%/i);
  if (!rateMatch) {
    throw new Error(`Failed to extract Delaware SUTA tax rate from document [${doc.title}]. Regex pattern match failed.`);
  }
  const rate = Number((Number(rateMatch[1]) / 100).toFixed(6));

  return {
    ruleCode: "DE_SUTA_EMPLOYER",
    name: "Delaware SUTA Unemployment Tax Employer Rate",
    category: "EMPLOYER_TAX",
    taxType: "STATE_UNEMPLOYMENT_TAX",
    jurisdictionCode: "DE",
    ruleType: "FLAT_RATE",
    rate,
    wageCap,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "DE_DEPT_OF_LABOR",
      title: "Delaware Department of Labor Employer UI Tax Information",
      statuteReference: "19 Del. C. § 3345",
      sourceUrl: "https://labor.delaware.gov/divisions/unemployment-insurance/",
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Delaware entry SUTA employer tax rate of ${rate * 100}% on wage cap $${wageCap}.`
    }
  };
}

export class DelawareSourceAdapter implements IAuthorityAdapter {
  public readonly authorityCode = "DE_DIV_OF_REVENUE";
  public readonly authorityName = "Delaware Division of Revenue";
  public readonly defaultJurisdiction: ITaxJurisdiction = {
    code: "DE",
    name: "State of Delaware",
    level: "STATE",
    state: "DE",
    parentJurisdictionCode: "US-FED"
  };

  /**
   * Parses official Delaware regulatory bulletin text and extracts Delaware tax rules.
   */
  public async parseDocument(
    document: IRawRegulatoryDocument,
    taxYear: number
  ): Promise<IExtractedTaxRule[]> {
    return [
      extractDelawarePitRule(document, taxYear),
      extractDelawareSutaRule(document, taxYear)
    ];
  }

  /**
   * Generates a realistic simulated Delaware regulatory bulletin for the given tax year.
   */
  public async fetchSimulatedNotice(taxYear: number): Promise<IRawRegulatoryDocument> {
    const content = `
Delaware Division of Revenue Employer Withholding Guide ${taxYear}:
Graduated personal income tax withholding applies across 7 brackets (0.0% to 6.6%).
Delaware Department of Labor: new employer SUTA rate is 2.3%.
The SUTA wage base limit is $10,500 for tax year ${taxYear}.
`;
    return {
      authority: "DE_DIV_OF_REVENUE",
      title: `Delaware Employer Tax Bulletin ${taxYear}`,
      sourceUrl: `https://revenue.delaware.gov/withholding-tax-information-${taxYear}`,
      publicationDate: `${taxYear - 1}-12-12`,
      content,
      documentHash: "sha256:simulated_de_hash_" + taxYear,
      documentType: "TAX_GUIDE"
    };
  }
}

