/**
 * @taxshield/tax-rule-packaging-engine
 * Public Entry Point for Module 1: Tax Rule Packaging Engine.
 */

// Domain Types & Schemas
export * from "./domain/types.js";
export * from "./domain/schemas.js";

// Validation Pipeline
export {
  validatePackageStructure,
  validateVersionStructure,
  type IValidationIssue,
  type IValidationResult
} from "./validation/structuralValidator.js";

export {
  validateRuleDateRanges,
  validatePackageDateRanges
} from "./validation/dateOverlapValidator.js";

export {
  validateVersionBounds,
  validatePackageBounds
} from "./validation/boundsValidator.js";

export {
  validateVersionCitations,
  validatePackageCitations
} from "./validation/citationValidator.js";

export {
  runValidationPipeline,
  type IPipelineReport,
  type IPipelineStepResult
} from "./validation/validationPipeline.js";

// Testing & Regression Harness
export {
  roundToCents,
  evaluateRuleVersion
} from "./testing/testEvaluator.js";

export {
  runVersionRegressionTests,
  runPackageRegressionTests,
  type ITestCaseResult,
  type IRegressionRunReport
} from "./testing/regressionRunner.js";

// Governance & Diff Engine
export {
  diffRuleVersions,
  type IFieldDelta,
  type IVersionDiffResult,
  type DiffChangeType
} from "./governance/diffEngine.js";

export {
  evaluateApprovalGate,
  type IApprovalGateResult,
  type IApprovalOptions
} from "./governance/approvalGate.js";

// Packaging & Cryptographic Sealing
export { stringifyCanonicalJson } from "./packaging/canonicalJson.js";

export {
  computeSha256,
  computeVersionChecksum,
  computePackageChecksum,
  verifyVersionChecksum
} from "./packaging/checksumService.js";

export {
  buildTaxRulePackage,
  type IBuildPackageOptions,
  type ISealedPackageResult
} from "./packaging/packageBuilder.js";

// Official Reference Seed Packages
export { federalTaxPackage2026 } from "./seeds/federal2026.js";
export { pennsylvaniaTaxPackage2026 } from "./seeds/pennsylvania2026.js";
export { texasTaxPackage2026 } from "./seeds/texas2026.js";
export { delawareTaxPackage2026 } from "./seeds/delaware2026.js";

// Ingestion Pipeline & Adapters
export * from "./ingestion/types.js";
export {
  loadLocalRegulatoryDocument,
  createRegulatoryDocument,
  type ILocalFileOptions
} from "./ingestion/documentFetcher.js";
export { IrsSourceAdapter } from "./ingestion/adapters/irsAdapter.js";
export { PennsylvaniaSourceAdapter } from "./ingestion/adapters/paAdapter.js";
export { TexasSourceAdapter } from "./ingestion/adapters/txAdapter.js";
export { DelawareSourceAdapter } from "./ingestion/adapters/deAdapter.js";
export { synthesizeTestCases } from "./ingestion/testCaseSynthesizer.js";
export {
  compileDraftPackage,
  type ICompileDraftOptions
} from "./ingestion/draftPackageCompiler.js";
export {
  runIngestionPipeline,
  registerAuthorityAdapter
} from "./ingestion/ingestionPipeline.js";

// Logging
export { logger, type ILogger, type LogLevel, type LogEntry } from "./logger/logger.js";

// Distribution Webserver
export {
  createPackageServer,
  createPackageRequestHandler,
  startPackageServer,
  buildPackageCatalog,
  getDefaultPackagesDir,
  type IPackageCatalogItem,
  type IPackageServerOptions
} from "./server/server.js";


