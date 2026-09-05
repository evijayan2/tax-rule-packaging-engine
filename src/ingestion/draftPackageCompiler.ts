import type {
  ITaxJurisdiction,
  ITaxRule,
  ITaxRulePackage,
  ITaxRuleVersion
} from "../domain/types.js";
import { synthesizeTestCases } from "./testCaseSynthesizer.js";
import type { IExtractedTaxRule } from "./types.js";

export interface ICompileDraftOptions {
  packageCode: string;
  packageName: string;
  version?: string;
  jurisdiction: ITaxJurisdiction;
  extractedRules: IExtractedTaxRule[];
  createdById?: string;
}

/**
 * Builds a single draft ITaxRule from an extracted rule definition.
 */
function compileDraftRule(
  extracted: IExtractedTaxRule,
  createdById: string,
  now: string
): ITaxRule {
  const testCases = synthesizeTestCases(extracted);

  const version: ITaxRuleVersion = {
    versionCode: `${extracted.ruleCode}-DRAFT-v1`,
    versionNumber: 1,
    status: "DRAFT",
    ruleType: extracted.ruleType,
    ruleData: {
      ...(extracted.rate !== undefined ? { rate: extracted.rate } : {}),
      ...(extracted.wageCap !== undefined ? { wageCap: extracted.wageCap } : {}),
      ...(extracted.additionalParameters ?? {})
    },
    effectiveFrom: extracted.effectiveFrom,
    effectiveTo: extracted.effectiveTo ?? null,
    createdAt: now,
    createdBy: createdById,
    citations: [
      {
        authority: extracted.citation.authority,
        title: extracted.citation.title,
        statuteReference: extracted.citation.statuteReference,
        sourceUrl: extracted.citation.sourceUrl,
        documentHash: extracted.citation.documentHash,
        publicationDate: extracted.citation.publicationDate,
        citationTier: extracted.citation.citationTier,
        excerpt: extracted.citation.excerpt
      }
    ],
    testCases
  };

  return {
    ruleCode: extracted.ruleCode,
    name: extracted.name,
    category: extracted.category,
    taxType: extracted.taxType,
    jurisdictionCode: extracted.jurisdictionCode,
    description: `Auto-ingested rule from ${extracted.citation.authority}`,
    versions: [version]
  };
}

/**
 * Compiles extracted regulatory rules into a fully structured, valid ITaxRulePackage in DRAFT status.
 * @param options - Compilation options including extracted rules and target jurisdiction.
 * @returns Draft TaxRulePackage ready for multi-tier validation and regression tests.
 */
export function compileDraftPackage(options: ICompileDraftOptions): ITaxRulePackage {
  const now = new Date().toISOString();
  const createdById = options.createdById ?? "SYSTEM_AUTO_INGESTION";

  const compiledRules = options.extractedRules.map((r) =>
    compileDraftRule(r, createdById, now)
  );

  return {
    packageCode: options.packageCode,
    name: options.packageName,
    version: options.version ?? "1.0.0-draft",
    jurisdictionCode: options.jurisdiction.code,
    generatedAt: now,
    jurisdictions: [options.jurisdiction],
    rules: compiledRules
  };
}

