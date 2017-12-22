
require('source-map-support').install();
import { readFile, time, profiled, printProfileResults } from '../util';

const INITIAL_STATE = '.#.'
                    + '..#'
                    + '###';

function size(pattern: string): number {
  return Math.sqrt(pattern.length);
}

function doSplit(pattern: string, n: number): string[] {
  const newSize = size(pattern) / n;
  const results: string[][] = [];
  const s = size(pattern);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = (y * s) + x;
      const ri = (Math.floor(y / newSize) * (s / newSize)) + Math.floor(x / newSize);
      results[ri] = results[ri] || [];
      results[ri].push(pattern.substr(i, 1))
    }
  }
  const result = results.map(r => r.join(''));
  return result;
}

const split = profiled<string[]>(
function split(pattern: string): string[] {
  const s = size(pattern);
  if (s === 3) {
    return [pattern];
  } else if (s % 2 === 0) {
    return doSplit(pattern, s / 2);
  } else if (s % 3 === 0) {
    return doSplit(pattern, s / 3);
  }
  throw `Failed to split pattern "${pattern}", not divisible by 2 or 3 (${s})!`;
}
)

const join = profiled<string>(
function join(patterns: string[]): string {
  const ps = Math.sqrt(patterns.length);
  const s = size(patterns[0]);

  let result = [];

  for (let py = 0; py < ps; py++) {
    for (let y = 0; y < s; y++) {
      for (let px = 0; px < ps; px++) {
        for (let x = 0; x < s; x++) {

          result.push(patterns[py * ps + px].substr(y * s + x, 1))

        }
      }
    }
  }

  return result.join('');
}
)

function map(pattern: string, maps: string[][]): string {
  const m = maps.find(m => m[0].length === pattern.length);
  if (!m) { throw `Could not find map with string length matching pattern "${pattern}"`; }
  let mapped = [];
  for (let i = 0; i < pattern.length; i++) {
    mapped[m[1].indexOf(m[0][i])] = pattern[i];
  }
  return mapped.join('');
}

function spin(pattern: string, times: number = 1): string {
  let result = pattern;
  for (let i = 0; i < times; i++) {
    result = map(result, [
      ['abcd', 'cadb'],
      ['abcdefghi', 'gdahebifc']
    ]);
  }
  return result;
}

function fliph(pattern: string): string {
  return map(pattern, [
    ['abcd', 'badc'],
    ['abcdefghi', 'cbafedihg']
  ]);
}

function variations(pattern: string): string[] {
  return [
    pattern,
    spin(pattern, 1),
    spin(pattern, 2),
    spin(pattern, 3),
    fliph(pattern),
    spin(fliph(pattern), 1),
    spin(fliph(pattern), 2),
    spin(fliph(pattern), 3),
  ]
}

type Rules = { [pattern: string]: string }

function enhance(pattern: string, rules: Rules): string {
  return rules[pattern];
}

function process(pattern: string, rules: Rules, iterations = 1): string {
  let result = pattern;
  prettyprint(pattern);
  console.log('');

  for(let i = 0; i < iterations; i++) {
    const splitPatterns = split(result);
    //prettyprintsplits(splitPatterns);
    const enhanced = splitPatterns.map(p => enhance(p, rules));
    //prettyprintsplits(enhanced);
    result = join(enhanced);

    //prettyprint(result);

    console.log((result.match(/#/g) || []).length);
    console.log('');
  }

  return result;
}

function prettyprintsplits(splits: string[]) {
  const ps = Math.sqrt(splits.length);
  const s = Math.sqrt(splits[0].length);

  const SPACER = ' '

  for (let py = 0; py < ps; py++) {
    const pRow = splits.slice(py * ps, py * ps + ps);
    for (let y = 0; y < s; y++) {
      const line = pRow.map(p => p.substr(y * s, s)).join(SPACER);
      console.log(line);
    }
    if (SPACER.length > 0) { console.log(SPACER); }
  }
  console.log('');
}

function prettyprint(pattern: string) {
  const s = size(pattern);
  for (let i = 0; i < s; i++) {
    console.log(pattern.substr(i * s, s))
  }
}

function parseRule(line: string): Rules {
  const parts = line.split(' => ').map(s => s.replace(/\//g, ''));
  const patterns = variations(parts[0]);
  return patterns.reduce((rules: Rules, pattern: string) => {
    return Object.assign(
      rules,
      { [pattern]: parts[1] },
    );
  }, {});
}

function parseRules(lines: string[]): Rules {
  return lines.reduce((rules: Rules, line: string) => {
    return Object.assign(
      rules,
      parseRule(line),
    );
  }, {});
}

const testInputRules = parseRules(readFile('21/testInput.txt').split('\n'));
const inputRules = parseRules(readFile('21/input.txt').split('\n'));
const otherInputRules = parseRules(readFile('21/otherInput.txt').split('\n'));

// console.log(join(split('1111222233334444')));

process(INITIAL_STATE, testInputRules, 2);

time(() => process(INITIAL_STATE, inputRules, 5));

const result = time(() => process(INITIAL_STATE, inputRules, 18));
printProfileResults();
// console.log((result.match(/#/g) || []).length);