import { z } from "zod";

/**
 * Zod validation schemas for TaxShield Versioned Tax Rules Architecture.
 * Validates domain integrity prior to packaging and sealing.
 */

export const jurisdictionLevelEnum = z.enum([
  "FEDERAL",
  "STATE",
  "COUNTY",
  "CITY",
  "MUNICIPALITY",
  "SCHOOL_DISTRICT",
  "SPECIAL_TAX_DISTRICT"
]);

export const ruleTypeEnum = z.enum([
  "FLAT_RATE",
  "BRACKET_PERCENTAGE",
  "STANDARD_ALLOWANCE",
  "THRESHOLD",
  "PER_MILE_RATE"
]);

export const ruleStatusEnum = z.enum([
  "DRAFT",
  "VALIDATION_PENDING",
  "VALIDATED",
  "REVIEW_PENDING",
  "APPROVED",
  "PUBLISHED",
  "SUPERSEDED",
  "RETIRED"
]);

export const citationTierEnum = z.enum([
  "TIER_1_OFFICIAL",
  "TIER_2_SECONDARY",
  "TIER_3_THIRD_PARTY"
]);

export const parameterValueTypeEnum = z.enum([
  "RATE",
  "AMOUNT",
  "THRESHOLD",
  "PERCENTAGE",
  "BOOLEAN",
  "STRING",
  "JSON"
]);

export const filingStatusEnum = z.enum([
  "SINGLE",
  "MARRIED_FILING_JOINTLY",
  "MARRIED_FILING_SEPARATELY",
  "HEAD_OF_HOUSEHOLD"
]);

export const jurisdictionSchema = z.object({
  code: z.string().min(1, "Jurisdiction code cannot be empty"),
  name: z.string().min(1, "Jurisdiction name cannot be empty"),
  level: jurisdictionLevelEnum,
  state: z.string().length(2).nullable().optional(),
  parentJurisdictionCode: z.string().nullable().optional()
});

export const citationSchema = z.object({
  authority: z.string().min(1, "Citation authority is required"),
  title: z.string().min(1, "Citation title is required"),
  statuteReference: z.string().min(1, "Statute reference is required"),
  sourceUrl: z.string().url("Source URL must be a valid URL"),
  documentHash: z.string().nullable().optional(),
  publicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Publication date must be ISO YYYY-MM-DD"),
  citationTier: citationTierEnum,
  excerpt: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export const parameterSchema = z.object({
  parameterCode: z.string().min(1, "Parameter code is required"),
  valueType: parameterValueTypeEnum,
  numericValue: z.number().nullable().optional(),
  stringValue: z.string().nullable().optional(),
  jsonValue: z.record(z.unknown()).nullable().optional(),
  unit: z.string().nullable().optional()
});

export const bracketSchema = z.object({
  filingStatus: filingStatusEnum,
  bracketSequence: z.number().int().positive(),
  incomeFrom: z.number().nonnegative(),
  incomeTo: z.number().positive().nullable().optional(),
  baseTax: z.number().nonnegative(),
  marginalRate: z.number().min(0).max(1)
});

export const testCaseSchema = z.object({
  id: z.string().min(1, "Test case ID is required"),
  description: z.string().min(1, "Test case description is required"),
  inputPayload: z.record(z.unknown()),
  expectedOutput: z.record(z.unknown())
});

export const ruleVersionSchema = z.object({
  versionCode: z.string().min(1, "Version code is required"),
  versionNumber: z.number().int().positive(),
  status: ruleStatusEnum,
  ruleType: ruleTypeEnum,
  ruleData: z.record(z.unknown()),
  effectiveFrom: z.string().datetime({ message: "effectiveFrom must be valid ISO datetime" }),
  effectiveTo: z.string().datetime({ message: "effectiveTo must be valid ISO datetime" }).nullable().optional(),
  citations: z.array(citationSchema).min(1, "At least one authoritative citation is required"),
  testCases: z.array(testCaseSchema).min(1, "At least one regression test case is required"),
  checksum: z.string().optional(),
  createdAt: z.string().datetime(),
  createdBy: z.string().min(1, "createdBy actor ID is required"),
  approvedAt: z.string().datetime().nullable().optional(),
  approvedBy: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  publishedBy: z.string().nullable().optional()
});

export const ruleSchema = z.object({
  ruleCode: z.string().min(1, "Rule code is required"),
  name: z.string().min(1, "Rule name is required"),
  category: z.string().min(1, "Category is required"),
  taxType: z.string().min(1, "Tax type is required"),
  jurisdictionCode: z.string().min(1, "Jurisdiction code is required"),
  description: z.string().nullable().optional(),
  versions: z.array(ruleVersionSchema).min(1, "Rule must have at least one version")
});

export const taxRulePackageSchema = z.object({
  packageCode: z.string().min(1, "Package code is required"),
  name: z.string().min(1, "Package name is required"),
  version: z.string().min(1, "Package semver version is required"),
  jurisdictionCode: z.string().min(1, "Primary jurisdiction code is required"),
  jurisdictions: z.array(jurisdictionSchema).min(1, "At least one jurisdiction required"),
  rules: z.array(ruleSchema).min(1, "At least one tax rule required"),
  manifestChecksum: z.string().optional(),
  generatedAt: z.string().datetime()
});

