import { runValidationPipeline } from "../validation/validationPipeline.js";
import { IrsSourceAdapter } from "./adapters/irsAdapter.js";
import { PennsylvaniaSourceAdapter } from "./adapters/paAdapter.js";
import { TexasSourceAdapter } from "./adapters/txAdapter.js";
import { DelawareSourceAdapter } from "./adapters/deAdapter.js";
import { compileDraftPackage } from "./draftPackageCompiler.js";
import type { IAuthorityAdapter, IIngestionOptions, IIngestionReport } from "./types.js";

const registeredAdapters: Map<string, IAuthorityAdapter> = new Map<string, IAuthorityAdapter>([
  ["IRS", new IrsSourceAdapter()],
  ["PA_DOR", new PennsylvaniaSourceAdapter()],
  ["PA", new PennsylvaniaSourceAdapter()],
  ["TX_COMPTROLLER", new TexasSourceAdapter()],
  ["TX", new TexasSourceAdapter()],
  ["DE_DIV_OF_REVENUE", new DelawareSourceAdapter()],
  ["DE", new DelawareSourceAdapter()]
]);

/**
 * Registers an authority adapter into the ingestion pipeline.
 * @param adapter - The adapter to register.
 */
export function registerAuthorityAdapter(adapter: IAuthorityAdapter): void {
  registeredAdapters.set(adapter.authorityCode.toUpperCase(), adapter);
}

/**
 * Executes an ingestion run for a specific authority and tax year.
 * Fails closed if the authority adapter is unconfigured.
 * @param options - Ingestion run parameters.
 * @returns Ingestion report containing the compiled DRAFT package and validation status.
 */
export async function runIngestionPipeline(
  options: IIngestionOptions
): Promise<IIngestionReport> {
  const code = options.authorityCode.toUpperCase();
  const adapter = registeredAdapters.get(code);

  if (!adapter) {
    return {
      success: false,
      authorityCode: options.authorityCode,
      taxYear: options.taxYear,
      rulesExtractedCount: 0,
      warnings: [`No registered authority adapter found for code: '${options.authorityCode}'`],
      ingestedAt: new Date().toISOString()
    };
  }

  const document = options.sourceDocument ?? await adapter.fetchSimulatedNotice(options.taxYear);
  const extractedRules = await adapter.parseDocument(document, options.taxYear);

  const pkg = compileDraftPackage({
    packageCode: `${adapter.defaultJurisdiction.code}-${options.taxYear}-INGESTED`,
    packageName: `${adapter.authorityName} Statutory Tax Rules ${options.taxYear}`,
    jurisdiction: adapter.defaultJurisdiction,
    extractedRules,
    createdById: options.createdById ?? `INGESTION_${adapter.authorityCode}`
  });

  const valReport = runValidationPipeline(pkg);
  const warnings = valReport.issues.map((i) => `[${i.code}] ${i.message}`);

  return {
    success: valReport.isValid,
    authorityCode: adapter.authorityCode,
    taxYear: options.taxYear,
    rulesExtractedCount: extractedRules.length,
    package: pkg,
    warnings,
    ingestedAt: new Date().toISOString()
  };
}
