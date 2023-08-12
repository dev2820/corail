import { isPromise } from "./utils";
import type { Fn } from "./type";

const exec = (params: any | any[], func: Fn) => {
  return isPromise(params)
    ? params.then((p) => func(p)).catch((p) => func(p))
    : func(params);
};

export const pipe = (...funcs: Fn[]) => {
  return (args: any) => {
    return funcs.reduce((result, f) => f(result), args);
  };
};

export const asyncPipe = (...funcs: Fn[]) => {
  return async (args: any) => {
    await funcs.reduce(exec, args);
  };
};
