import { describe, it, expect } from "vitest";
import { rail } from "..";

const setup = () => {
  const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
  const asyncSum = (...nums) => {
    return new Promise((solve) => {
      solve(sum(...nums));
    });
  };
  const sumAfter1sec = (...nums) => {
    return new Promise((solve) => {
      setTimeout(() => {
        solve(sum(...nums));
      }, 1000);
    });
  };

  const multi = (...nums) => nums.reduce((a, b) => a * b, 1);
  const asyncMulti = (...nums) => {
    return new Promise((solve) => {
      solve(multi(...nums));
    });
  };
  const multiAfter1sec = (...nums) => {
    return new Promise((solve) => {
      setTimeout(() => {
        solve(multi(...nums));
      }, 1000);
    });
  };
  return { sum, multi, asyncSum, sumAfter1sec, asyncMulti, multiAfter1sec };
};

describe("rail", () => {
  it("should run all functions step by step and return Result", async () => {
    const { sum, multi } = setup();
    const sum3 = (...nums) => sum(...nums, 3);
    const multi2 = (...nums) => multi(...nums, 2);

    const result = await rail(multi2, sum3)(1); // 1 * 2 + 3

    expect(result.isFailed).toBe(false);
    expect(result.data).toBe(5);
  });

  it("should return failed Result if there are failed execution at least one", async () => {
    const { sum, multi } = setup();
    const sum3 = (...nums) => sum(...nums, 3);
    const multi2 = (...nums) => multi(...nums, 2);
    const maybeFail = (data) => {
      throw data;
    };

    const result = await rail(multi2, maybeFail, sum3)(1); // 1 * 2 + 3...?

    expect(result.isFailed).toBe(true);
    expect(result.err).toBe(2);
  });

  it("should works with promise", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);

    const result = await rail(asyncMulti2, asyncSum3)(1);

    expect(result.isFailed).toBe(false);
    expect(result.data).toBe(5);
  });

  it("should works with promise reject", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);
    const maybeFail = (data) => {
      throw data;
    };
    const result = await rail(asyncMulti2, maybeFail, asyncSum3)(1);

    expect(result.isFailed).toBe(true);
    expect(result.err).toBe(2);
  });
});
