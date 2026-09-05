import { readFileSync, writeFileSync } from "node:fs";
import { runValidationPipeline } from "../validation/validationPipeline.js";
import { runPackageRegressionTests } from "../testing/regressionRunner.js";
import { buildTaxRulePackage } from "../packaging/packageBuilder.js";
import { diffRuleVersions } from "../governance/diffEngine.js";
import type { ITaxRulePackage } from "../domain/types.js";
import { logger } from "../logger/logger.js";

/**
 * Loads and parses a JSON tax rule package file.
 */
function loadPackageFile(path: string): ITaxRulePackage {
  const content = readFileSync(path, "utf8");
  return JSON.parse(content) as ITaxRulePackage;
}

/**
 * Command: Validate a package file against structural, date, bounds, and citation rules.
 */
function handleValidate(filePath: string): void {
  const pkg = loadPackageFile(filePath);
  const report = runValidationPipeline(pkg);
  if (report.isValid) {
    logger.info(`Validation PASSED: ${pkg.packageCode} (${pkg.version}) has 0 issues.`);
  } else {
    logger.error(`Validation FAILED for ${pkg.packageCode}:`, { issues: report.issues });
    process.exitCode = 1;
  }
}

/**
 * Command: Run regression test suite on a package file.
 */
function handleTest(filePath: string): void {
  const pkg = loadPackageFile(filePath);
  const report = runPackageRegressionTests(pkg);
  if (report.passed) {
    logger.info(`Regression tests PASSED: ${report.passCount}/${report.totalTests} passed.`);
  } else {
    logger.error(`Regression tests FAILED: ${report.failCount}/${report.totalTests} failed.`, {
      results: report.results.filter((r) => !r.passed)
    });
    process.exitCode = 1;
  }
}

/**
 * Command: Compare two versions.
 */
function handleDiff(basePath: string, targetPath: string): void {
  const base = loadPackageFile(basePath);
  const target = loadPackageFile(targetPath);
  const baseVer = base.rules[0]?.versions[0];
  const targetVer = target.rules[0]?.versions[0];

  if (!baseVer || !targetVer) {
    logger.error("Diff failed: each package must have at least one rule with one version.");
    process.exitCode = 1;
    return;
  }

  const diff = diffRuleVersions(baseVer, targetVer);
  logger.info(`Diff between ${diff.sourceVersionCode} and ${diff.targetVersionCode}:`, {
    hasDifferences: diff.hasDifferences,
    deltas: diff.deltas
  });
}

/**
 * Command: Build and cryptographically seal a package file.
 */
function handleBuild(filePath: string, outPath?: string): void {
  const pkg = loadPackageFile(filePath);
  const result = buildTaxRulePackage(pkg, { publisherId: "CLI_PUBLISHER", allowSingleOwnerOverride: true });
  const destination = outPath ?? filePath.replace(/\.json$/, ".taxpack.json");
  writeFileSync(destination, result.exportedJson, "utf8");
  logger.info(`Sealed package successfully created: ${destination}`, {
    manifestChecksum: result.package.manifestChecksum
  });
}

/**
 * Main CLI dispatcher.
 */
export function main(): void {
  const [,, command, arg1, arg2] = process.argv;

  switch (command) {
    case "validate":
      if (!arg1) return logger.error("Usage: taxpack validate <file.json>");
      handleValidate(arg1);
      break;
    case "test":
      if (!arg1) return logger.error("Usage: taxpack test <file.json>");
      handleTest(arg1);
      break;
    case "diff":
      if (!arg1 || !arg2) return logger.error("Usage: taxpack diff <base.json> <target.json>");
      handleDiff(arg1, arg2);
      break;
    case "build":
      if (!arg1) return logger.error("Usage: taxpack build <file.json> [out.taxpack.json]");
      handleBuild(arg1, arg2);
      break;
    default:
      logger.info("TaxRule Packaging Engine CLI. Commands: validate, test, diff, build.");
  }
}

if (process.argv[1]?.endsWith("cli.ts") || process.argv[1]?.endsWith("cli.js")) {
  main();
}
