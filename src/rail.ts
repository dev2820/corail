import { isPromise } from "./utils";
import type { Fn } from "./type";

type Failed = {
  failed: Symbol;
  err: any;
};

const FailSymbol = Symbol("failed");

const failed = (err: any): Failed => {
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

export const rail = <Fns extends Fn[]>(...funcs: Fns) => {
  return async (args: any): Promise<Failed | ReturnType<Fns[number]>> => {
    try {
      const result = await funcs.reduce(execFunc, args);

      return result;
    } catch (err) {
      return failed(err);
    }
  };
};
