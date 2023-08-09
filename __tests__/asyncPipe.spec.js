import { describe, it, expect } from "vitest";
import { asyncPipe } from "..";

const setup = () => {
  const sum = (nums) => nums.reduce((a, b) => a + b, 0);
  const asyncSum = (nums) => {
    return new Promise((solve) => {
      solve(sum(nums));
    });
  };
  const sumAfter1sec = (nums) => {
    return new Promise((solve) => {
      setTimeout(() => {
        solve(sum(nums));
      }, 1000);
    });
  };

  const multi = (nums) => nums.reduce((a, b) => a * b, 1);
  const asyncMulti = (nums) => {
    return new Promise((solve) => {
      solve(multi(nums));
    });
  };
  const multiAfter1sec = (nums) => {
    return new Promise((solve) => {
      setTimeout(() => {
        solve(multi(nums));
      }, 1000);
    });
  };

  return { sum, multi, asyncSum, sumAfter1sec, asyncMulti, multiAfter1sec };
};

describe("asyncPipe", () => {
  it("should run all functions step by step", async () => {
    const sum3 = (num) => num + 3;
    const multi2 = (num) => num * 2;

    const f = asyncPipe(multi2, sum3);
    const result1 = await f(1); // (1 * 2) + 3

    expect(result1).toBe(5);
  });
  it("should works with promise", async () => {
    const { sum, asyncSum, asyncMulti } = setup();
    const asyncSum3 = (num) => asyncSum([num, 3]);
    const asyncMulti2 = (nums) => asyncMulti([nums, 2]);

    const f = asyncPipe(sum, asyncMulti2, asyncSum3);
    const result1 = await f(1); // ((1 * 2) + 3)

    expect(result1).toBe(5);
  });

  it("should works even promise reject", async () => {
    const { sum, multi } = setup();
    const rejectMulti2 = async (num) => {
      const result = multi([num, 2]);
      return await Promise.reject(result);
    };
    const rejectSum3 = async (num) => {
      const result = await sum([num, 3]);
      return await Promise.reject(result);
    };

    const f = asyncPipe(rejectMulti2, rejectSum3);

    const result = await f(1); // ((1 * 2) + 3)

    expect(result).toBe(5);
  });

  it("should resolve if pipe finished with resolve function ", async () => {
    const { sum, multi } = setup();
    const rejectMulti2 = async (num) => {
      const result = multi([num, 2]);
      return await Promise.reject(result);
    };
    const rejectSum3 = async (num) => {
      const result = await sum([num, 3]);
      return await Promise.reject(result);
    };
    const resolveSum2 = async (num) => {
      const result = await sum([num, 2]);
      return await Promise.resolve(result);
    };

    const f = asyncPipe(rejectMulti2, rejectSum3, resolveSum2);

    const result = await f(1); // ((1 * 2) + 3) + 2
    expect(result).toBe(7);
  });
});
