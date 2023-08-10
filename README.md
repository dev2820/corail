# Corail

Corail is the ROP(Railway Oriented Programming) Implementation library

## What is Railway Oriented Programmging

"Railway-Oriented Programming" (ROP) is a code style that saves developers from exception handling hell

see me for detail: https://fsharpforfunandprofit.com/posts/recipe-part2/

## Usage Examples

### With functions

rail works like asynchronous-capable pipe

```js
const multi2 = (num) => num * 2;
const sum3 = (num) => num + 3;

const result = await corail.rail(multi2, sum3)(1); // expect 1 * 2 + 3

result; // to be 5
```

### Create failed with throw

You can create an explicitly failed value through the `throw`. if fail occured, then the `rail` stops running the rest of the functions and returns a failed result

```js
const sum3 = (num) => num + 3;
const multi2 = (num) => num * 2;
const throwData = (data) => {
  // Throw something, like an error or a message, so you can see why the rail was failed
  throw data;
};

const result = await corail.rail(multi2, throwData, sum3)(1); // 1 * 2 ...x

corail.isFailed(result); // true
result.err; // 2
```

The result will be 2.

let's see step by step

1. `multi2` will works because there are no failed functions
2. `throwData` will throw the result of multi2 (it is `2`)
3. `sum3` will not work because there are failed function (throwData)
4. As a result, the result failed, so, `corail.isFailed` evaluates the result as a failture and `result.err` is 2 (thrown value)

### With promise

The `rail` also works well with Promise

```js
const asyncSum3 = (num) => Promise.resolve(num + 3);
const asyncMulti2 = (num) => Promise.resolve(num * 2);

const result = await corail.rail(asyncMulti2, asyncSum3)(1);

corail.isFailed(result); // false
result; // 5
```

If more than one `promise` is included, the `promise` will be returned as a result.

After `await`, there will be the expected value

### Create failed with Reject

Like throw, if there is rejected promise, then the result failed, stop running the rest of the functions

```js
const asyncSum3 = (num) => Promise.resolve(num + 3);
const asyncMulti2 = (num) => Promise.resolve(num * 2);
const rejectData = (data) => Promise.reject(data);

const result = await corail.rail(asyncMulti2, rejectData, asyncSum3)(1); // 1 * 2 ... x

corail.isFailed(result); // true
result.err; // 2
```

### With async functions

As it worked well with promise, async function also works well

```js
const asyncSum3 = async (num) => await Promise.resolve(num + 3);
const asyncMulti2 = (num) => Promise.resolve(num * 2);

const result = await corail.rail(asyncMulti2, asyncSum3)(1);

corail.isFailed(result); // false
result; // 5
```

### With fetch

```js
const fetchTodo = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return res.json();
};
const getTitle = (todo) => todo.title;
const result = await corail.rail(fetchTodo, getTitle)(1);

corail.isFailed(result); // false;
result; // "delectus aut autem"
```
