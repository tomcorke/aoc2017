import * as path from 'path';
import * as fs from 'fs';
import { performance } from 'perf_hooks';

function consolePerfOutput(time: number) {
  console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
  console.log('');
}
function time(func: Function, perfCallback = consolePerfOutput) {
  const start = performance.now();
  const result = func();
  const time = performance.now() - start;
  if (perfCallback) {
    perfCallback(time);
  }
  return result;
}

const profileResults: {
  [key: string]: number[]
} = {};
function profile<T>(name: string, func: Function): (...args: any[]) => T {
  return function(...args: any[]): T {
    return time(() => func.apply(this, args), (time) => {
      profileResults[name] = profileResults[name] || [];
      profileResults[name].push(time);
    }) as T;
  }
}

function profiled<T>(target: Function): (...args: any[]) => T {
  return profile<T>(target.name, target);
}

function sum(values: number[]): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum;
}
function avg(values: number[]): number {
  return sum(values) / values.length;
}
function round(value: number, decimalPlaces: number = 0) {
  return Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

function printProfileResults() {
  console.log(Object.keys(profileResults).reduce((results, key) => {
    return Object.assign(results, {
        [key]: {
          samples: profileResults[key].length,
          avg: round(avg(profileResults[key]), 1),
          max: round(Math.max(...profileResults[key]), 1),
          total: round(sum(profileResults[key]), 1),
        }
      });
  }, {}));
}

function readFile(relativeFilePath: string) {
  return fs.readFileSync(path.resolve(__dirname, relativeFilePath), 'utf8');
}

export {
  time,
  readFile,
  profile,
  profiled,
  printProfileResults
}