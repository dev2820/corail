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

/**
 * TODO: success 혹은 failed를 반환한다.
 *
 * 함수 목록을 입력받는다.
 * 함수 목록을 순차적으로 실행하며, 입력받은 인자를 순차적으로 넘긴다
 * async/await에서도 동작한다.
 * 각 함수에서 일어나는 에러를 캐치하며 실패 혹은 성공을 반환한다
 * 실패하면 다음 함수는 실행하지 않는다.
 * 성공하면 다음 함수를 실행하고 실행한 결과를 다시 넘긴다.
 */
const FailSymbol = Symbol("failed");

export const failed = (err) => {
  return {
    isFailed: FailSymbol,
    err,
  };
};

export const isFailed = (value) => {
  return value instanceof Object && value.isFailed === FailSymbol;
};

const exec2 = (params, func) => {
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

export const rail = (...funcs) => {
  return async (args) => {
    try {
      const result = await funcs.reduce(exec2, args);

      if (isFailed(result)) return result;
      return result;
    } catch (err) {
      return failed(err);
    }
  };
};
