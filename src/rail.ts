import { isPromise } from "./utils";

type Failed<T = any> = {
  failed: Symbol;
  err: T;
};
type Fn = (...args: any[]) => any;

const FailSymbol = Symbol("failed");

const failed = <T = any>(err: T): Failed => {
  return {
    failed: FailSymbol,
    err,
  };
};

const execFunc = (params: unknown, func: Fn) => {
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

export const isFailed = (value: any): value is Failed => {
  return value instanceof Object && value.failed === FailSymbol;
};

export const rail = <T extends Fn[]>(...funcs: T) => {
  return async (args: any): Promise<Failed | ReturnType<T[number]>> => {
    try {
      const result = await funcs.reduce(execFunc, args);

      return result;
    } catch (err) {
      return failed(err);
    }
  };
};
