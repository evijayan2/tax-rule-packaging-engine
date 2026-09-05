import { describe, it, expect } from "vitest";
import { texasTaxPackage2026 } from "../../src/seeds/texas2026.js";
import { delawareTaxPackage2026 } from "../../src/seeds/delaware2026.js";
import { runValidationPipeline } from "../../src/validation/validationPipeline.js";
import { runPackageRegressionTests } from "../../src/testing/regressionRunner.js";
import { buildTaxRulePackage } from "../../src/packaging/packageBuilder.js";

describe("Texas and Delaware Reference Packages", () => {
  it("validates Texas 2026 package and passes 100% regression tests", () => {
    const val = runValidationPipeline(texasTaxPackage2026);
    expect(val.isValid).toBe(true);

    const reg = runPackageRegressionTests(texasTaxPackage2026);
    expect(reg.passed).toBe(true);
    expect(reg.failCount).toBe(0);
    expect(reg.passCount).toBe(5); // 2 PIT + 3 SUTA

    const sealed = buildTaxRulePackage(texasTaxPackage2026, {
      publisherId: "TEST_SEALER",
      allowSingleOwnerOverride: true
    });
    expect(sealed.package.manifestChecksum?.startsWith("sha256:")).toBe(true);
  });

  it("validates Delaware 2026 progressive bracket package and passes 100% regression tests", () => {
    const val = runValidationPipeline(delawareTaxPackage2026);
    expect(val.isValid).toBe(true);

    const reg = runPackageRegressionTests(delawareTaxPackage2026);
    expect(reg.passed).toBe(true);
    expect(reg.failCount).toBe(0);
    expect(reg.passCount).toBe(5); // 3 PIT + 2 SUTA

    const sealed = buildTaxRulePackage(delawareTaxPackage2026, {
      publisherId: "TEST_SEALER",
      allowSingleOwnerOverride: true
    });
    expect(sealed.package.manifestChecksum?.startsWith("sha256:")).toBe(true);
  });
});
