import { describe, it, expect } from "vitest";
import { pipe } from "..";

const setup = () => {
  const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
  const multi = (...nums) => nums.reduce((a, b) => a * b, 1);

  return { sum, multi };
};
describe("pipe", () => {
  it("should run all functions step by step", () => {
    const { sum, multi } = setup();
    const sum3 = (...nums) => sum(...nums, 3);
    const multi2 = (...nums) => multi(...nums, 2);

    const f = pipe(sum, multi2, sum3);
    const result1 = f(1); // (1 * 2) + 3
    const result2 = f(1, 2); // ((1 + 2) * 2) + 3

    expect(result1).toBe(5);
    expect(result2).toBe(9);
  });
});
