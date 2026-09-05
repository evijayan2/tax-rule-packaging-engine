import { describe, it, expect } from "vitest";
import { TexasSourceAdapter } from "../../src/ingestion/adapters/txAdapter.js";

describe("txAdapter", () => {
  const adapter = new TexasSourceAdapter();

  it("fetches simulated Texas regulatory notice", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    expect(doc.authority).toBe("TX_COMPTROLLER");
    expect(doc.content).toContain("no personal income tax in Texas");
    expect(doc.documentHash.startsWith("sha256:")).toBe(true);
  });

  it("parses notice text and extracts 0% PIT rate and SUTA rule", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    const rules = await adapter.parseDocument(doc, 2026);

    expect(rules).toHaveLength(2);

    const pit = rules.find((r) => r.ruleCode === "TX_SIT_RATE");
    expect(pit).toBeDefined();
    expect(pit?.rate).toBe(0.0);
    expect(pit?.citation.citationTier).toBe("TIER_1_OFFICIAL");
    expect(pit?.citation.statuteReference).toBe("Tex. Const. art. VIII, § 24-a");

    const suta = rules.find((r) => r.ruleCode === "TX_SUTA_EMPLOYER");
    expect(suta).toBeDefined();
    expect(suta?.rate).toBe(0.027);
    expect(suta?.wageCap).toBe(9000);
    expect(suta?.citation.statuteReference).toBe("Tex. Lab. Code § 204.006");
  });
});

