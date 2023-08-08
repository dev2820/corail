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

export const failed = (message, data) => {
  return {
    isFailed: true,
    message,
    data,
  };
};

export const success = (data) => {
  return {
    isFailed: false,
    data,
  };
};
/**
 * TODO: success 혹은 failed를 반환한다.
 */
const rail = (...funcs) => {
  return (...args) => {
    try {
      return funcs.reduce(exec, args);
    } catch (err) {}
  };
};
