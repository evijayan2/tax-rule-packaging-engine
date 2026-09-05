import { describe, it, expect } from "vitest";
import { PennsylvaniaSourceAdapter } from "../../src/ingestion/adapters/paAdapter.js";

describe("paAdapter", () => {
  const adapter = new PennsylvaniaSourceAdapter();

  it("fetches simulated PA REV-419 guide", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    expect(doc.authority).toBe("PA_DEPT_OF_REVENUE");
    expect(doc.content).toContain("personal income tax rate");
    expect(doc.documentHash.startsWith("sha256:")).toBe(true);
  });

  it("parses REV-419 text and extracts 3.07% PIT rule", async () => {
    const doc = await adapter.fetchSimulatedNotice(2026);
    const rules = await adapter.parseDocument(doc, 2026);

    expect(rules).toHaveLength(1);
    const pit = rules[0];
    expect(pit.ruleCode).toBe("PA_PIT_RATE");
    expect(pit.rate).toBe(0.0307);
    expect(pit.citation.citationTier).toBe("TIER_1_OFFICIAL");
    expect(pit.citation.statuteReference).toBe("72 P.S. § 7302; 61 Pa. Code § 101.1");
  });
});
