/**
 * Domain types for TaxShield Versioned Tax Rules Architecture.
 * Governs jurisdictions, tax rules, versions, parameters, citations, and test cases.
 */

export type JurisdictionLevel =
  | "FEDERAL"
  | "STATE"
  | "COUNTY"
  | "CITY"
  | "MUNICIPALITY"
  | "SCHOOL_DISTRICT"
  | "SPECIAL_TAX_DISTRICT";

export type RuleType =
  | "FLAT_RATE"
  | "BRACKET_PERCENTAGE"
  | "STANDARD_ALLOWANCE"
  | "THRESHOLD"
  | "PER_MILE_RATE";

export type RuleStatus =
  | "DRAFT"
  | "VALIDATION_PENDING"
  | "VALIDATED"
  | "REVIEW_PENDING"
  | "APPROVED"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "RETIRED";

export type CitationTier =
  | "TIER_1_OFFICIAL"
  | "TIER_2_SECONDARY"
  | "TIER_3_THIRD_PARTY";

export type ParameterValueType =
  | "RATE"
  | "AMOUNT"
  | "THRESHOLD"
  | "PERCENTAGE"
  | "BOOLEAN"
  | "STRING"
  | "JSON";

export type FilingStatus =
  | "SINGLE"
  | "MARRIED_FILING_JOINTLY"
  | "MARRIED_FILING_SEPARATELY"
  | "HEAD_OF_HOUSEHOLD";

export interface ITaxJurisdiction {
  code: string;
  name: string;
  level: JurisdictionLevel;
  state?: string | null;
  parentJurisdictionCode?: string | null;
}

export interface IRuleSourceReference {
  authority: string;
  title: string;
  statuteReference: string;
  sourceUrl: string;
  documentHash?: string | null;
  publicationDate: string;
  citationTier: CitationTier;
  excerpt?: string | null;
  notes?: string | null;
}

export interface ITaxParameter {
  parameterCode: string;
  valueType: ParameterValueType;
  numericValue?: number | null;
  stringValue?: string | null;
  jsonValue?: Record<string, unknown> | null;
  unit?: string | null;
}

export interface ITaxBracket {
  filingStatus: FilingStatus;
  bracketSequence: number;
  incomeFrom: number;
  incomeTo?: number | null;
  baseTax: number;
  marginalRate: number;
}

export interface ITaxRuleTestCase {
  id: string;
  description: string;
  inputPayload: Record<string, unknown>;
  expectedOutput: Record<string, unknown>;
}

export interface ITaxRuleData {
  rate?: number;
  wageCap?: number;
  supplementalRate?: number;
  annualAllowance?: number;
  brackets?: ITaxBracket[];
  parameters?: ITaxParameter[];
  [key: string]: unknown;
}

export interface ITaxRuleVersion {
  versionCode: string;
  versionNumber: number;
  status: RuleStatus;
  ruleType: RuleType;
  ruleData: ITaxRuleData;
  effectiveFrom: string;
  effectiveTo?: string | null;
  citations: IRuleSourceReference[];
  testCases: ITaxRuleTestCase[];
  checksum?: string;
  createdAt: string;
  createdBy: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  publishedAt?: string | null;
  publishedBy?: string | null;
}

export interface ITaxRule {
  ruleCode: string;
  name: string;
  category: string;
  taxType: string;
  jurisdictionCode: string;
  description?: string | null;
  versions: ITaxRuleVersion[];
}

export interface ITaxRulePackage {
  packageCode: string;
  name: string;
  version: string;
  jurisdictionCode: string;
  jurisdictions: ITaxJurisdiction[];
  rules: ITaxRule[];
  manifestChecksum?: string;
  generatedAt: string;
}

