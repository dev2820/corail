import { describe, it, expect } from "vitest";

const setup = () => {
  const symbol = Symbol("unique");
  return { symbol };
};
describe("symbol", () => {
  it("should be unique", async () => {
    const { symbol } = setup();

    expect(symbol).not.toEqual(Symbol("unique"));
  });
});
