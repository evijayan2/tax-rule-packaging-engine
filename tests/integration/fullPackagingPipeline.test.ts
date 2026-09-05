import { describe, it, expect } from "vitest";
import { buildTaxRulePackage } from "../../src/packaging/packageBuilder.js";
import { verifyVersionChecksum } from "../../src/packaging/checksumService.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";

describe("Full Packaging Pipeline Integration", () => {
  it("builds, validates, tests, and seals the federal 2026 package end-to-end", () => {
    const result = buildTaxRulePackage(federalTaxPackage2026, {
      publisherId: "INTEGRATION_TEST_PUBLISHER",
      allowSingleOwnerOverride: true
    });

    expect(result.validationReport.isValid).toBe(true);
    expect(result.regressionReport.passed).toBe(true);
    expect(result.package.manifestChecksum).toBeDefined();
    expect(result.package.manifestChecksum?.startsWith("sha256:")).toBe(true);

    // Verify all versions sealed to PUBLISHED
    for (const rule of result.package.rules) {
      for (const ver of rule.versions) {
        expect(ver.status).toBe("PUBLISHED");
        expect(ver.checksum).toBeDefined();
        expect(verifyVersionChecksum(ver)).toBe(true);
      }
    }

    // Verify JSON export
    const reparsed = JSON.parse(result.exportedJson);
    expect(reparsed.packageCode).toBe("US-FED-2026");
  });

  it("builds, validates, tests, and seals the pennsylvania 2026 package end-to-end", () => {
    const result = buildTaxRulePackage(pennsylvaniaTaxPackage2026, {
      publisherId: "INTEGRATION_TEST_PUBLISHER",
      allowSingleOwnerOverride: true
    });

    expect(result.validationReport.isValid).toBe(true);
    expect(result.regressionReport.passed).toBe(true);
    expect(result.package.manifestChecksum).toBeDefined();

    const paVersion = result.package.rules[0].versions[0];
    expect(paVersion.status).toBe("PUBLISHED");
    expect(verifyVersionChecksum(paVersion)).toBe(true);
  });

  it("fails closed when building an invalid package", () => {
    const invalidPkg = {
      ...pennsylvaniaTaxPackage2026,
      rules: [
        {
          ...pennsylvaniaTaxPackage2026.rules[0],
          versions: [
            {
              ...pennsylvaniaTaxPackage2026.rules[0].versions[0],
              ruleData: { rate: -0.5 } // Invalid negative rate
            }
          ]
        }
      ]
    };

    expect(() => {
      buildTaxRulePackage(invalidPkg, { publisherId: "TEST_PUB" });
    }).toThrow(/Package validation failed/);
  });
});
