import { describe, it, expect, vi } from "vitest";
import { logger } from "../../src/logger/logger.js";

describe("logger", () => {
  it("logs info without throwing", () => {
    const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    logger.info("Test info message", { key: "value" });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("logs warn without throwing", () => {
    const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    logger.warn("Test warning message");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("logs error to stderr without throwing", () => {
    const spy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    logger.error("Test error message");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

