import { describe, it, expect } from "vitest";
import { asyncPipe } from "..";

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

describe("asyncPipe", () => {
  it("should run all functions step by step", () => {
    const { sum, multi } = setup();
    const sum3 = (...nums) => sum(...nums, 3);
    const multi2 = (...nums) => multi(...nums, 2);

    const f = asyncPipe(sum, multi2, sum3);
    const result1 = f(1); // (1 * 2) + 3
    const result2 = f(1, 2); // ((1 + 2) * 2) + 3

    expect(result1).toBe(5);
    expect(result2).toBe(9);
  });
  it("should works with promise", async () => {
    const { sum, asyncSum, asyncMulti } = setup();
    const square = (num) => num * num;
    const asyncSum3 = (...nums) => asyncSum(...nums, 3);
    const asyncMulti2 = (...nums) => asyncMulti(...nums, 2);

    const f = asyncPipe(sum, asyncMulti2, asyncSum3);
    const f2 = asyncPipe(sum, asyncMulti2, asyncSum3, square);
    const result1 = await f(1); // ((1 * 2) + 3)
    const result2 = await f2(1); // ((1 * 2) + 3)^2
    const result3 = await f2(1, 2); // (((1 + 2) * 2) + 3)^2

    expect(result1).toBe(5);
    expect(result2).toBe(25);
    expect(result3).toBe(81);
  });

  it("should works even promise reject", async () => {
    const { sum, multi } = setup();
    const rejectMulti2 = async (...nums) => {
      const result = multi(...nums, 2);
      return await Promise.reject(result);
    };
    const rejectSum3 = async (...nums) => {
      const result = await sum(...nums, 3);
      return await Promise.reject(result);
    };

    const f = asyncPipe(sum, rejectMulti2, rejectSum3);

    let result = 0;
    try {
      await f(1); // ((1 * 2) + 3)
      result = -1;
    } catch (res) {
      result = res;
    } finally {
      expect(result).toBe(5);
    }
  });

  it("should resolve if pipe finished with resolve function ", async () => {
    const { sum, multi } = setup();
    const rejectMulti2 = async (...nums) => {
      const result = multi(...nums, 2);
      return await Promise.reject(result);
    };
    const rejectSum3 = async (...nums) => {
      const result = await sum(...nums, 3);
      return await Promise.reject(result);
    };
    const resolveSum2 = async (...nums) => {
      const result = await sum(...nums, 2);
      return await Promise.resolve(result);
    };

    const f = asyncPipe(sum, rejectMulti2, rejectSum3, resolveSum2);

    let result = 0;
    try {
      result = await f(1); // ((1 * 2) + 3) + 2
    } catch (res) {
      result = -1;
    } finally {
      expect(result).toBe(7);
    }
  });
});
