import { performance } from 'perf_hooks';

function time(func: Function) {
  const start = performance.now();
  const result = func();
  const time = performance.now() - start;
  console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
  console.log('');
  return result;
}

export {
  time
}