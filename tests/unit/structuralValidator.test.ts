import { describe, it, expect } from "vitest";
import { validatePackageStructure, validateVersionStructure } from "../../src/validation/structuralValidator.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";

describe("structuralValidator", () => {
  it("passes validation for valid federal package", () => {
    const res = validatePackageStructure(federalTaxPackage2026);
    expect(res.isValid).toBe(true);
    expect(res.issues).toHaveLength(0);
  });

  it("fails validation if packageCode is missing", () => {
    const invalidPkg = { ...federalTaxPackage2026, packageCode: "" };
    const res = validatePackageStructure(invalidPkg);
    expect(res.isValid).toBe(false);
    expect(res.issues.some((i) => i.path.includes("packageCode"))).toBe(true);
  });

  it("passes validation for valid version", () => {
    const version = federalTaxPackage2026.rules[0].versions[0];
    const res = validateVersionStructure(version);
    expect(res.isValid).toBe(true);
  });

  it("fails validation if effectiveFrom is not a valid ISO date", () => {
    const version = federalTaxPackage2026.rules[0].versions[0];
    const invalidVersion = { ...version, effectiveFrom: "invalid-date" };
    const res = validateVersionStructure(invalidVersion);
    expect(res.isValid).toBe(false);
  });
});
