import { describe, it, expect } from "vitest";
import * as corail from "../src/index";

describe("railRight", () => {
  it("should run all functions step by step and return Result", async () => {
    const sum3 = (num: number) => num + 3;
    const multi2 = (num: number) => num * 2;

    const result = await corail.railRight(sum3, multi2)(1); // 1 * 2 + 3

    expect(corail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should return failed Result if there are failed execution at least one", async () => {
    const sum3 = (num: number) => num + 3;
    const multi2 = (num: number) => num * 2;
    const throwData = (data: number) => {
      throw data;
    };

    const result1 = await corail.railRight(sum3, multi2, throwData)(1); // 1 * 2 ...x
    const result2 = await corail.railRight(sum3, throwData, multi2)(1); // 1 * 2 ...x
    const result3 = await corail.railRight(throwData, sum3, multi2)(1); // 1 * 2 ...x

    expect(corail.isFailed(result1)).toBe(true);
    expect(corail.isFailed(result1) && result1.err).toBe(1);

    expect(corail.isFailed(result2)).toBe(true);
    expect(corail.isFailed(result2) && result2.err).toBe(2);

    expect(corail.isFailed(result3)).toBe(true);
    expect(corail.isFailed(result3) && result3.err).toBe(5);
  });

  it("should works with promise", async () => {
    const asyncSum3 = (num: number) => Promise.resolve(num + 3);
    const asyncMulti2 = (num: number) => Promise.resolve(num * 2);

    const result = await corail.railRight(asyncSum3, asyncMulti2)(1);

    expect(corail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });

  it("should works with promise reject", async () => {
    const asyncSum3 = (num: number) => Promise.resolve(num + 3);
    const asyncMulti2 = (num: number) => Promise.resolve(num * 2);
    const rejectData = (data: number) => Promise.reject(data);

    const result1 = await corail.railRight(
      asyncSum3,
      asyncMulti2,
      rejectData
    )(1); // 1 ... x
    const result2 = await corail.railRight(
      asyncSum3,
      rejectData,
      asyncMulti2
    )(1); // 1 * 2 ... x
    const result3 = await corail.railRight(
      rejectData,
      asyncSum3,
      asyncMulti2
    )(1); // 1 * 2 + 3 ... x

    expect(corail.isFailed(result1)).toBe(true);
    expect(corail.isFailed(result1) && result1.err).toBe(1);

    expect(corail.isFailed(result2)).toBe(true);
    expect(corail.isFailed(result2) && result2.err).toBe(2);

    expect(corail.isFailed(result3)).toBe(true);
    expect(corail.isFailed(result3) && result3.err).toBe(5);
  });

  it("should works even returned data is undefined", async () => {
    const asyncSum3 = (num: number) => Promise.resolve(num + 3);
    const asyncMulti2 = (num: number) => Promise.resolve(num * 2);
    const returnNothing = () => undefined;
    const result = await corail.railRight(
      asyncSum3,
      returnNothing,
      asyncMulti2
    )(1);

    expect(corail.isFailed(result)).toBe(false);
    expect(result).toBeNaN();
  });

  it("should works with functions that mixed with async/await functions and normal functions", async () => {
    const asyncSum3 = async (num: number) => await Promise.resolve(num + 3);
    const asyncMulti2 = (num: number) => Promise.resolve(num * 2);
    const result = await corail.railRight(asyncSum3, asyncMulti2)(1);

    expect(corail.isFailed(result)).toBe(false);
    expect(result).toBe(5);
  });
});
