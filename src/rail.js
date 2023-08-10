import { isPromise } from "./utils";

const FailSymbol = Symbol("failed");

const failed = (err) => {
  return {
    isFailed: FailSymbol,
    err,
  };
};

const execFunc = (params, func) => {
  if (isPromise(params)) {
    return params
      .then((p) => (isFailed(p) ? p : func(p)))
      .catch((err) => failed(err));
  }

  try {
    return isFailed(params) ? params : func(params);
  } catch (err) {
    return failed(err);
  }
};

export const isFailed = (value) => {
  return value instanceof Object && value.isFailed === FailSymbol;
};

export const rail = (...funcs) => {
  return async (args) => {
    try {
      const result = await funcs.reduce(execFunc, args);

      if (isFailed(result)) return result;
      return result;
    } catch (err) {
      return failed(err);
    }
  };
};
