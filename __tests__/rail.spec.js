import { describe, it, expect } from "vitest";
import { rail, isFailed } from "..";

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

    expect(isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should return failed Result if there are failed execution at least one", async () => {
    const { sum, multi } = setup();
    const sum3 = (...nums) => sum(...nums, 3);
    const multi2 = (...nums) => multi(...nums, 2);
    const throwData = (data) => {
      throw data;
    };

    const result = await rail(multi2, throwData, sum3)(1); // 1 * 2 ...x

    expect(isFailed(result)).toBe(true);
    expect(result.err).toBe(2);
  });

  it("should works with promise", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);

    const result = await rail(asyncMulti2, asyncSum3)(1);

    expect(isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should works with promise reject", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);
    const rejectData = (data) => {
      return Promise.reject(data);
    };
    const result = await rail(asyncMulti2, rejectData, asyncSum3)(1);

    expect(isFailed(result)).toBe(true);
    expect(result.err).toBe(2);
  });

  it("should works even returned data is undefined", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);
    const returnNothing = () => {
      return undefined;
    };
    const result = await rail(asyncMulti2, returnNothing, asyncSum3)(1);

    expect(isFailed(result)).toBe(false);
    expect(result).toBeNaN();
  });

  it("should works with functions that mixed with async/await functions and normal functions", async () => {
    const { asyncSum, asyncMulti } = setup();
    const asyncSum3 = async (...nums) => {
      return (await asyncSum(...nums)) + 3;
    };
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);
    const result = await rail(asyncMulti2, asyncSum3)(1);

    expect(isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });
});
