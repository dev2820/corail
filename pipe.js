import { isPromise } from "./utils";

const exec = (params, func) => {
  return isPromise(params)
    ? params.then((p) => func(p)).catch((p) => func(p))
    : func(params);
};

export const pipe = (...funcs) => {
  return (args) => {
    return funcs.reduce((result, f) => f(result), args);
  };
};

export const asyncPipe = (...funcs) => {
  return async (...args) => {
    try {
      return await funcs.reduce(exec, args);
    } catch (err) {
      return err;
    }
  };
};
