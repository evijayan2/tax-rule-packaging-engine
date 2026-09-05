import type { ITaxJurisdiction } from "../../domain/types.js";
import type { IAuthorityAdapter, IExtractedTaxRule, IRawRegulatoryDocument } from "../types.js";

/**
 * Extracts PA Personal Income Tax (PIT) flat rate from PA DOR guide text.
 */
function extractPennsylvaniaPitRule(
  doc: IRawRegulatoryDocument,
  taxYear: number
): IExtractedTaxRule {
  const rateMatch = doc.content.match(/personal income tax rate is ([\d.]+) percent/i);
  const rate = rateMatch ? Number((Number(rateMatch[1]) / 100).toFixed(6)) : 0.0307;

  return {
    ruleCode: "PA_PIT_RATE",
    name: "Pennsylvania Personal Income Tax (PIT)",
    category: "WITHHOLDING",
    taxType: "STATE_INCOME_TAX",
    jurisdictionCode: "PA",
    ruleType: "FLAT_RATE",
    rate,
    effectiveFrom: `${taxYear}-01-01T00:00:00.000Z`,
    effectiveTo: null,
    citation: {
      authority: "PA_DEPT_OF_REVENUE",
      title: doc.title,
      statuteReference: "72 P.S. § 7302; 61 Pa. Code § 101.1",
      sourceUrl: doc.sourceUrl,
      documentHash: doc.documentHash,
      publicationDate: doc.publicationDate,
      citationTier: "TIER_1_OFFICIAL",
      excerpt: `Extracted Pennsylvania flat PIT rate ${rate * 100}%.`
    }
  };
}

export class PennsylvaniaSourceAdapter implements IAuthorityAdapter {
  public readonly authorityCode = "PA_DOR";
  public readonly authorityName = "Pennsylvania Department of Revenue";
  public readonly defaultJurisdiction: ITaxJurisdiction = {
    code: "PA",
    name: "Commonwealth of Pennsylvania",
    level: "STATE",
    state: "PA",
    parentJurisdictionCode: "US-FED"
  };

  /**
   * Parses official PA Department of Revenue REV-419 text and extracts state income tax rules.
   */
  public async parseDocument(
    document: IRawRegulatoryDocument,
    taxYear: number
  ): Promise<IExtractedTaxRule[]> {
    return [extractPennsylvaniaPitRule(document, taxYear)];
  }

  /**
   * Generates a realistic simulated PA DOR REV-419 guide bulletin for the given tax year.
   */
  public async fetchSimulatedNotice(taxYear: number): Promise<IRawRegulatoryDocument> {
    const content = `
Commonwealth of Pennsylvania - Employer Withholding Guide (REV-419) Tax Year ${taxYear}:
The Pennsylvania personal income tax rate is 3.07 percent (0.0307).
All taxable compensation paid to Pennsylvania residents or nonresidents working in PA is subject to withholding.
`;
    return {
      authority: "PA_DEPT_OF_REVENUE",
      title: `2026 PA Employer Withholding Guide (REV-419)`,
      sourceUrl: `https://www.revenue.pa.gov/FormsandPublications/FormsforBusinesses/EmployerWithholding/Documents/rev-419-${taxYear}.pdf`,
      publicationDate: `${taxYear - 1}-12-01`,
      content,
      documentHash: "sha256:simulated_pa_hash_" + taxYear,
      documentType: "TAX_GUIDE"
    };
  }
}
