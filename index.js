const isPromise = (value) => value instanceof Promise;

const execFunc = (params, func) => {
  if (Array.isArray(params)) {
    return func(...params);
  } else {
    return func(params);
  }
};

const exec = (params, func) => {
  return isPromise(params)
    ? params.then((p) => execFunc(p, func)).catch((p) => execFunc(p, func))
    : execFunc(params, func);
};

export const pipe = (...funcs) => {
  return (...args) => {
    return funcs.reduce((result, f) => {
      return execFunc(result, f);
    }, args);
  };
};

export const asyncPipe = (...funcs) => {
  return (...args) => {
    return funcs.reduce(exec, args);
  };
};

export const failed = (err) => {
  return {
    isFailed: FailSymbol,
    err,
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

export const rail = (...funcs) => {
  return async (args) => {
    try {
      const result = await funcs.reduce((result, func) => {
        return exec2(result, func);
      }, args);

      if (isFailed(result)) return result;

      return result;
    } catch (err) {
      return failed(err);
    }
  };
};

// Promise이면 현재 값을 판단할 수 없기 때문에 then,catch로 연결한다.
const exec2 = (params, func) => {
  return isPromise(params)
    ? params
        .then((p) => {
          if (isFailed(p)) return p;
          return func(p);
        })
        .catch((p) => failed(p))
    : func(params);
};

export const isFailed = (value) => {
  return value instanceof Object && value.isFailed === FailSymbol;
};
