import * as path from 'path';
import * as fs from 'fs';
import { performance } from 'perf_hooks';

function time(func: Function) {
  const start = performance.now();
  const result = func();
  const time = performance.now() - start;
  console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
  console.log('');
  return result;
}

function readFile(relativeFilePath: string) {
  return fs.readFileSync(path.resolve(__dirname, relativeFilePath), 'utf8');
}

export {
  time,
  readFile
}