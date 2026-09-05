import { describe, it, expect } from "vitest";
import { DelawareSourceAdapter } from "../../src/ingestion/adapters/deAdapter.js";

describe("deAdapter", () => {
  const adapter = new DelawareSourceAdapter();

  it("fetches simulated Delaware regulatory bulletin", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    expect(doc.authority).toBe("DE_DIV_OF_REVENUE");
    expect(doc.content).toContain("7 brackets");
    expect(doc.documentHash.startsWith("sha256:")).toBe(true);
  });

  it("parses notice text and extracts graduated brackets and SUTA rule", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    const rules = await adapter.parseDocument(doc, 2026);

    expect(rules).toHaveLength(2);

    const pit = rules.find((r) => r.ruleCode === "DE_SIT_BRACKETS");
    expect(pit).toBeDefined();
    expect(pit?.ruleType).toBe("BRACKET_PERCENTAGE");
    expect(pit?.citation.citationTier).toBe("TIER_1_OFFICIAL");
    expect(pit?.citation.statuteReference).toBe("30 Del. C. § 1102; 30 Del. C. § 1151");

    const brackets = pit?.additionalParameters?.brackets as any[];
    expect(brackets).toHaveLength(7);
    expect(brackets[0].marginalRate).toBe(0.0);
    expect(brackets[6].marginalRate).toBe(0.066);

    const suta = rules.find((r) => r.ruleCode === "DE_SUTA_EMPLOYER");
    expect(suta).toBeDefined();
    expect(suta?.rate).toBe(0.023);
    expect(suta?.wageCap).toBe(10500);
    expect(suta?.citation.statuteReference).toBe("19 Del. C. § 3345");
  });
});

