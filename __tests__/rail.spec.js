import { describe, it, expect } from "vitest";
import * as korail from "..";

describe("rail", () => {
  it("should run all functions step by step and return Result", async () => {
    const sum3 = (num) => num + 3;
    const multi2 = (num) => num * 2;

    const result = await korail.rail(multi2, sum3)(1); // 1 * 2 + 3

    expect(korail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should return failed Result if there are failed execution at least one", async () => {
    const sum3 = (num) => num + 3;
    const multi2 = (num) => num * 2;
    const throwData = (data) => {
      throw data;
    };

    const result1 = await korail.rail(throwData, multi2, sum3)(1); // 1 * 2 ...x
    const result2 = await korail.rail(multi2, throwData, sum3)(1); // 1 * 2 ...x
    const result3 = await korail.rail(multi2, sum3, throwData)(1); // 1 * 2 ...x

    expect(korail.isFailed(result1)).toBe(true);
    expect(result1.err).toBe(1);

    expect(korail.isFailed(result2)).toBe(true);
    expect(result2.err).toBe(2);

    expect(korail.isFailed(result3)).toBe(true);
    expect(result3.err).toBe(5);
  });

  it("should works with promise", async () => {
    const asyncSum3 = (num) => Promise.resolve(num + 3);
    const asyncMulti2 = (num) => Promise.resolve(num * 2);

    const result = await korail.rail(asyncMulti2, asyncSum3)(1);

    expect(korail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should works with promise reject", async () => {
    const asyncSum3 = (num) => Promise.resolve(num + 3);
    const asyncMulti2 = (num) => Promise.resolve(num * 2);
    const rejectData = (data) => Promise.reject(data);

    const result1 = await korail.rail(rejectData, asyncMulti2, asyncSum3)(1); // 1 ... x
    const result2 = await korail.rail(asyncMulti2, rejectData, asyncSum3)(1); // 1 * 2 ... x
    const result3 = await korail.rail(asyncMulti2, asyncSum3, rejectData)(1); // 1 * 2 + 3 ... x

    expect(korail.isFailed(result1)).toBe(true);
    expect(result1.err).toBe(1);

    expect(korail.isFailed(result2)).toBe(true);
    expect(result2.err).toBe(2);

    expect(korail.isFailed(result3)).toBe(true);
    expect(result3.err).toBe(5);
  });

  it("should works even returned data is undefined", async () => {
    const asyncSum3 = (num) => Promise.resolve(num + 3);
    const asyncMulti2 = (num) => Promise.resolve(num * 2);
    const returnNothing = () => undefined;
    const result = await korail.rail(asyncMulti2, returnNothing, asyncSum3)(1);

    expect(korail.isFailed(result)).toBe(false);
    expect(result).toBeNaN();
  });

  it("should works with functions that mixed with async/await functions and normal functions", async () => {
    const asyncSum3 = async (num) => await Promise.resolve(num + 3);
    const asyncMulti2 = (num) => Promise.resolve(num * 2);
    const result = await korail.rail(asyncMulti2, asyncSum3)(1);

    expect(korail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });
});
