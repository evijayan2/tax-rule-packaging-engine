import type { ITaxRulePackage, ITaxRuleVersion } from "../domain/types.js";
import { runValidationPipeline, type IPipelineReport } from "../validation/validationPipeline.js";
import { runPackageRegressionTests, type IRegressionRunReport } from "../testing/regressionRunner.js";
import { computePackageChecksum, computeVersionChecksum } from "./checksumService.js";

export interface IBuildPackageOptions {
  publisherId: string;
  allowSingleOwnerOverride?: boolean;
}

export interface ISealedPackageResult {
  package: ITaxRulePackage;
  validationReport: IPipelineReport;
  regressionReport: IRegressionRunReport;
  exportedJson: string;
}

/**
 * Seals an individual version by attaching checksum and updating status to PUBLISHED.
 */
function sealVersion(version: ITaxRuleVersion, publisherId: string, timestamp: string): ITaxRuleVersion {
  const checksum = computeVersionChecksum(version);
  return {
    ...version,
    status: "PUBLISHED",
    checksum,
    publishedAt: timestamp,
    publishedBy: publisherId
  };
}

/**
 * Builds, validates, tests, and cryptographically seals an immutable TaxRulePackage.
 * Fails closed if any validation checks or regression tests fail.
 * @param draftPackage - The raw unsealed tax rule package.
 * @param options - Build options containing publisher identity.
 * @returns Sealed package result.
 */
export function buildTaxRulePackage(
  draftPackage: ITaxRulePackage,
  options: IBuildPackageOptions
): ISealedPackageResult {
  // Step 1: Run Multi-Tier Validation Pipeline
  const validationReport = runValidationPipeline(draftPackage);
  if (!validationReport.isValid) {
    throw new Error(
      `Package validation failed with ${validationReport.totalIssues} issue(s): ` +
      validationReport.issues.map((i) => `[${i.code}] ${i.message}`).join("; ")
    );
  }

  // Step 2: Run Regression Test Suite (100% pass required)
  const regressionReport = runPackageRegressionTests(draftPackage);
  if (!regressionReport.passed) {
    throw new Error(
      `Package regression test suite failed: ${regressionReport.failCount} failed of ${regressionReport.totalTests} tests.`
    );
  }

  // Step 3: Seal all versions and generate package manifest
  const now = new Date().toISOString();
  const sealedRules = draftPackage.rules.map((rule) => ({
    ...rule,
    versions: rule.versions.map((v) => sealVersion(v, options.publisherId, now))
  }));

  const intermediatePkg: ITaxRulePackage = {
    ...draftPackage,
    rules: sealedRules,
    generatedAt: now
  };

  const manifestChecksum = computePackageChecksum(intermediatePkg);
  const sealedPackage: ITaxRulePackage = {
    ...intermediatePkg,
    manifestChecksum
  };

  return {
    package: sealedPackage,
    validationReport,
    regressionReport,
    exportedJson: JSON.stringify(sealedPackage, null, 2)
  };
}

