import { describe, it, expect } from "vitest";
import { diffRuleVersions } from "../../src/governance/diffEngine.js";
import { pennsylvaniaTaxPackage2026 } from "../../src/seeds/pennsylvania2026.js";
import { federalTaxPackage2026 } from "../../src/seeds/federal2026.js";
import { federalTaxPackage2027 } from "../../src/seeds/federal2027.js";
import type { ITaxRuleVersion } from "../../src/domain/types.js";

describe("diffEngine", () => {
  const v1 = pennsylvaniaTaxPackage2026.rules[0].versions[0];

  it("reports no differences when comparing identical versions", () => {
    const diff = diffRuleVersions(v1, v1);
    expect(diff.hasDifferences).toBe(false);
    expect(diff.deltas).toHaveLength(0);
  });

  it("identifies statutory wage cap delta between federal 2026 and 2027 FICA SS", () => {
    const ss2026 = federalTaxPackage2026.rules.find((r) => r.ruleCode === "FED_FICA_SS")!.versions[0];
    const ss2027 = federalTaxPackage2027.rules.find((r) => r.ruleCode === "FED_FICA_SS")!.versions[0];

    const diff = diffRuleVersions(ss2026, ss2027);
    expect(diff.hasDifferences).toBe(true);
    const wageCapDelta = diff.deltas.find((d) => d.field === "ruleData.wageCap");
    expect(wageCapDelta).toBeDefined();
    expect(wageCapDelta?.changeType).toBe("MODIFIED");
    expect(wageCapDelta?.oldValue).toBe(176100);
    expect(wageCapDelta?.newValue).toBe(192300);
  });

  it("identifies rate modification between v1 and v2", () => {
    const v2: ITaxRuleVersion = {
      ...v1,
      versionCode: "PA-PIT-2027-v1",
      versionNumber: 2,
      ruleData: { rate: 0.0315 }
    };

    const diff = diffRuleVersions(v1, v2);
    expect(diff.hasDifferences).toBe(true);
    const rateDelta = diff.deltas.find((d) => d.field === "ruleData.rate");
    expect(rateDelta).toBeDefined();
    expect(rateDelta?.changeType).toBe("MODIFIED");
    expect(rateDelta?.oldValue).toBe(0.0307);
    expect(rateDelta?.newValue).toBe(0.0315);
  });

  it("identifies effective date shift", () => {
    const v2: ITaxRuleVersion = {
      ...v1,
      effectiveFrom: "2027-01-01T00:00:00.000Z"
    };

    const diff = diffRuleVersions(v1, v2);
    expect(diff.hasDifferences).toBe(true);
    expect(diff.deltas.some((d) => d.field === "effectiveFrom")).toBe(true);
  });
});

