import { describe, it, expect } from "vitest";
import { IrsSourceAdapter } from "../../src/ingestion/adapters/irsAdapter.js";

describe("irsAdapter", () => {
  const adapter = new IrsSourceAdapter();

  it("fetches simulated IRS regulatory notice", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    expect(doc.authority).toBe("IRS");
    expect(doc.content).toContain("social security wage base");
    expect(doc.documentHash.startsWith("sha256:")).toBe(true);
  });

  it("parses IRS notice text and extracts FICA and mileage rules", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    const rules = await adapter.parseDocument(doc, 2026);

    expect(rules).toHaveLength(3);

    const ss = rules.find((r) => r.ruleCode === "FED_FICA_SS");
    expect(ss).toBeDefined();
    expect(ss?.rate).toBe(0.062);
    expect(ss?.wageCap).toBe(176100);
    expect(ss?.citation.citationTier).toBe("TIER_1_OFFICIAL");
    expect(ss?.citation.statuteReference).toBe("26 U.S. Code § 3101(a)");

    const med = rules.find((r) => r.ruleCode === "FED_FICA_MEDICARE");
    expect(med).toBeDefined();
    expect(med?.rate).toBe(0.0145);

    const mileage = rules.find((r) => r.ruleCode === "IRS_MILEAGE");
    expect(mileage).toBeDefined();
    expect(mileage?.rate).toBe(0.67);
  });
});

