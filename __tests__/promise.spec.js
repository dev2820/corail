import { describe, it, expect } from "vitest";

describe("promise", () => {
  it("should throw error when rejected", async () => {
    expect(async () => await Promise.reject(1)).rejects.toThrowError();
  });

  it("should pass every 'then' before 'catch' when rejected", async () => {
    const result = await Promise.reject(0)
      .then((res) => res + 1) // passed
      .then((res) => res + 1) // passed
      .catch((res) => res) // act
      .then((res) => res + 1) // act
      .then((res) => res + 1) // act
      .catch((res) => res); // passed
    expect(result).toBe(2);
  });
});
