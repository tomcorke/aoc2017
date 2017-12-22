"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const INITIAL_STATE = '.#.'
    + '..#'
    + '###';
function size(pattern) {
    return Math.sqrt(pattern.length);
}
function doSplit(pattern, n) {
    const newSize = size(pattern) / n;
    const results = [];
    const s = size(pattern);
    for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
            const i = (y * s) + x;
            const ri = (Math.floor(y / newSize) * (s / newSize)) + Math.floor(x / newSize);
            results[ri] = results[ri] || [];
            results[ri].push(pattern.substr(i, 1));
        }
    }
    const result = results.map(r => r.join(''));
    return result;
}
function split(pattern) {
    const s = size(pattern);
    if (s === 3) {
        return [pattern];
    }
    else if (s % 2 === 0) {
        return doSplit(pattern, s / 2);
    }
    else if (s % 3 === 0) {
        return doSplit(pattern, s / 3);
    }
    throw `Failed to split pattern "${pattern}", not divisible by 2 or 3 (${s})!`;
}
function join(patterns) {
    const ps = Math.sqrt(patterns.length);
    const s = size(patterns[0]);
    let result = [];
    for (let py = 0; py < ps; py++) {
        for (let y = 0; y < s; y++) {
            for (let px = 0; px < ps; px++) {
                for (let x = 0; x < s; x++) {
                    result.push(patterns[py * ps + px].substr(y * s + x, 1));
                }
            }
        }
    }
    return result.join('');
}
function map(pattern, maps) {
    const m = maps.find(m => m[0].length === pattern.length);
    if (!m) {
        throw `Could not find map with string length matching pattern "${pattern}"`;
    }
    let mapped = [];
    for (let i = 0; i < pattern.length; i++) {
        mapped[m[1].indexOf(m[0][i])] = pattern[i];
    }
    return mapped.join('');
}
function spin(pattern, times = 1) {
    let result = pattern;
    for (let i = 0; i < times; i++) {
        result = map(result, [
            ['abcd', 'cadb'],
            ['abcdefghi', 'gdahebifc'],
            ['abcdefghijklmnop', 'mieanjfbokgcplhd'],
        ]);
    }
    return result;
}
function fliph(pattern) {
    return map(pattern, [
        ['abcd', 'badc'],
        ['abcdefghi', 'cbafedihg'],
        ['abcdefghijklmnop', 'dcbahgfelkjiponm'],
    ]);
}
function flipv(pattern) {
    return map(pattern, [
        ['abcd', 'cdab'],
        ['abcdefghi', 'ghidefabc'],
        ['abcdefghijklmnop', 'mnopijklefghabcd'],
    ]);
}
function variations(pattern) {
    return [
        pattern,
        spin(pattern, 1),
        spin(pattern, 2),
        spin(pattern, 3),
        fliph(pattern),
        spin(fliph(pattern), 1),
        spin(fliph(pattern), 2),
        spin(fliph(pattern), 3),
    ];
}
function findRule(pattern, rules) {
    const v = variations(pattern);
    return rules.find(r => v.some(v => v === r[0]));
}
function enhance(pattern, rules) {
    const rule = findRule(pattern, rules);
    if (!rule) {
        throw `No rule found matching pattern "${pattern}"`;
    }
    return rule[1];
}
function process(pattern, rules, iterations = 1) {
    let result = pattern;
    prettyprint(pattern);
    console.log('');
    for (let i = 0; i < iterations; i++) {
        const splitPatterns = split(result);
        prettyprintsplits(splitPatterns);
        const enhanced = splitPatterns.map(p => enhance(p, rules));
        prettyprintsplits(enhanced);
        result = join(enhanced);
        prettyprint(result);
        console.log((result.match(/#/g) || []).length);
        console.log('');
    }
    return result;
}
function prettyprintsplits(splits) {
    const ps = Math.sqrt(splits.length);
    const s = Math.sqrt(splits[0].length);
    const SPACER = ' ';
    for (let py = 0; py < ps; py++) {
        const pRow = splits.slice(py * ps, py * ps + ps);
        for (let y = 0; y < s; y++) {
            const line = pRow.map(p => p.substr(y * s, s)).join(SPACER);
            console.log(line);
        }
        if (SPACER.length > 0) {
            console.log(SPACER);
        }
    }
    console.log('');
}
function prettyprint(pattern) {
    const s = size(pattern);
    for (let i = 0; i < s; i++) {
        console.log(pattern.substr(i * s, s));
    }
}
function parseRule(line) {
    return line.split(' => ').map(s => s.replace(/\//g, ''));
}
const testInputRules = util_1.readFile('21/testInput.txt').split('\n').map(parseRule);
const inputRules = util_1.readFile('21/input.txt').split('\n').map(parseRule);
const otherInputRules = util_1.readFile('21/otherInput.txt').split('\n').map(parseRule);
// console.log(join(split('1111222233334444')));
// process(INITIAL_STATE, testInputRules, 2);
const result = process(INITIAL_STATE, inputRules, 18);
// console.log((result.match(/#/g) || []).length); 
