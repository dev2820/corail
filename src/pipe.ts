import { isPromise } from "./utils";

const exec = (params: any | any[], func: Function) => {
  return isPromise(params)
    ? params.then((p) => func(p)).catch((p) => func(p))
    : func(params);
};

export const pipe = (...funcs: Function[]) => {
  return (args: any) => {
    return funcs.reduce((result, f) => f(result), args);
  };
};

export const asyncPipe = (...funcs: Function[]) => {
  return async (args: any) => {
    await funcs.reduce(exec, args);
  };
};
