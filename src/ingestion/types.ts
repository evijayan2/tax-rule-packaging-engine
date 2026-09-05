import type {
  CitationTier,
  ITaxJurisdiction,
  ITaxRulePackage,
  ITaxRuleTestCase,
  RuleType
} from "../domain/types.js";

export interface IRawRegulatoryDocument {
  authority: string;
  title: string;
  sourceUrl: string;
  publicationDate: string;
  content: string;
  documentHash: string;
  documentType: string;
}

export interface IExtractedCitation {
  authority: string;
  title: string;
  statuteReference: string;
  sourceUrl: string;
  documentHash: string;
  publicationDate: string;
  citationTier: CitationTier;
  excerpt: string;
}

export interface IExtractedTaxRule {
  ruleCode: string;
  name: string;
  category: string;
  taxType: string;
  jurisdictionCode: string;
  ruleType: RuleType;
  rate?: number;
  wageCap?: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  citation: IExtractedCitation;
  additionalParameters?: Record<string, unknown>;
}

export interface IIngestionOptions {
  authorityCode: string;
  taxYear: number;
  sourceDocument?: IRawRegulatoryDocument;
  createdById?: string;
}

export interface IIngestionReport {
  success: boolean;
  authorityCode: string;
  taxYear: number;
  rulesExtractedCount: number;
  package?: ITaxRulePackage;
  warnings: string[];
  ingestedAt: string;
}

export interface IAuthorityAdapter {
  readonly authorityCode: string;
  readonly authorityName: string;
  readonly defaultJurisdiction: ITaxJurisdiction;

  parseDocument(
    document: IRawRegulatoryDocument,
    taxYear: number
  ): Promise<IExtractedTaxRule[]>;

  fetchSimulatedNotice(taxYear: number): Promise<IRawRegulatoryDocument>;
}

