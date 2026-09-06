import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { federalTaxPackage2026 } from "../seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../seeds/pennsylvania2026.js";
import { texasTaxPackage2026 } from "../seeds/texas2026.js";
import { delawareTaxPackage2026 } from "../seeds/delaware2026.js";
import { pennsylvaniaLocalTaxPackage2026 } from "../seeds/paLocal2026.js";
import { newJerseyTaxPackage2026 } from "../seeds/newJersey2026.js";
import { newYorkTaxPackage2026 } from "../seeds/newYork2026.js";
import { ohioTaxPackage2026 } from "../seeds/ohio2026.js";
import { floridaTaxPackage2026 } from "../seeds/florida2026.js";
import { buildTaxRulePackage } from "../packaging/packageBuilder.js";
import { logger } from "../logger/logger.js";

/**
 * Builds and outputs sealed reference seed packages for Federal, PA, TX, DE, NJ, NY, OH, and FL 2026.
 */
export function generateSeedPackages(): void {
  const outputDir = join(process.cwd(), "packages");
  mkdirSync(outputDir, { recursive: true });

  const publisherId = "SYSTEM_GOV_SEALER";

  const packagesToBuild = [
    { name: "US-FED-2026.taxpack.json", pkg: federalTaxPackage2026, label: "Federal 2026" },
    { name: "PA-STATE-2026.taxpack.json", pkg: pennsylvaniaTaxPackage2026, label: "Pennsylvania 2026" },
    { name: "PA-LOCAL-2026.taxpack.json", pkg: pennsylvaniaLocalTaxPackage2026, label: "Pennsylvania Local 2026" },
    { name: "TX-STATE-2026.taxpack.json", pkg: texasTaxPackage2026, label: "Texas 2026" },
    { name: "DE-STATE-2026.taxpack.json", pkg: delawareTaxPackage2026, label: "Delaware 2026" },
    { name: "NJ-STATE-2026.taxpack.json", pkg: newJerseyTaxPackage2026, label: "New Jersey 2026" },
    { name: "NY-STATE-2026.taxpack.json", pkg: newYorkTaxPackage2026, label: "New York 2026" },
    { name: "OH-STATE-2026.taxpack.json", pkg: ohioTaxPackage2026, label: "Ohio 2026" },
    { name: "FL-STATE-2026.taxpack.json", pkg: floridaTaxPackage2026, label: "Florida 2026" },
  ];

  for (const item of packagesToBuild) {
    const result = buildTaxRulePackage(item.pkg, {
      publisherId,
      allowSingleOwnerOverride: true
    });
    const targetPath = join(outputDir, item.name);
    writeFileSync(targetPath, result.exportedJson, "utf8");
    logger.info(`Sealed ${item.label} package written to ${targetPath}`, {
      manifestChecksum: result.package.manifestChecksum
    });
  }
}

generateSeedPackages();
