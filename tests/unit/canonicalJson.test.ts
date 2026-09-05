import { describe, it, expect } from "vitest";
import { stringifyCanonicalJson } from "../../src/packaging/canonicalJson.js";

describe("canonicalJson", () => {
  it("sorts dictionary keys alphabetically regardless of insertion order", () => {
    const objA = { zebra: 1, apple: 2, mango: 3 };
    const objB = { mango: 3, zebra: 1, apple: 2 };

    const strA = stringifyCanonicalJson(objA);
    const strB = stringifyCanonicalJson(objB);

    expect(strA).toBe(strB);
    expect(strA).toBe('{"apple":2,"mango":3,"zebra":1}');
  });

  it("handles nested objects and arrays deterministically", () => {
    const complex = {
      b: [3, 2, 1],
      a: { y: "test", x: 10 }
    };
    const res = stringifyCanonicalJson(complex);
    expect(res).toBe('{"a":{"x":10,"y":"test"},"b":[3,2,1]}');
  });
});
