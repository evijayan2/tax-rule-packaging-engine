import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { federalTaxPackage2026 } from "../seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../seeds/pennsylvania2026.js";
import { buildTaxRulePackage } from "../packaging/packageBuilder.js";
import { logger } from "../logger/logger.js";

/**
 * Builds and outputs sealed reference seed packages for Federal and PA 2026.
 */
export function generateSeedPackages(): void {
  const outputDir = join(process.cwd(), "packages");
  mkdirSync(outputDir, { recursive: true });

  const publisherId = "SYSTEM_GOV_SEALER";

  // 1. Federal 2026
  const fedResult = buildTaxRulePackage(federalTaxPackage2026, {
    publisherId,
    allowSingleOwnerOverride: true
  });
  const fedPath = join(outputDir, "US-FED-2026.taxpack.json");
  writeFileSync(fedPath, fedResult.exportedJson, "utf8");
  logger.info(`Sealed Federal 2026 package written to ${fedPath}`, {
    manifestChecksum: fedResult.package.manifestChecksum
  });

  // 2. Pennsylvania 2026
  const paResult = buildTaxRulePackage(pennsylvaniaTaxPackage2026, {
    publisherId,
    allowSingleOwnerOverride: true
  });
  const paPath = join(outputDir, "PA-STATE-2026.taxpack.json");
  writeFileSync(paPath, paResult.exportedJson, "utf8");
  logger.info(`Sealed Pennsylvania 2026 package written to ${paPath}`, {
    manifestChecksum: paResult.package.manifestChecksum
  });
}

generateSeedPackages();

