"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
function loopSlice(series = [], start, length) {
    const end = start + length;
    if (end > series.length) {
        return series.slice(start, series.length).concat(series.slice(0, end - series.length));
    }
    else {
        return series.slice(start, end);
    }
}
function loopReplace(series, start, values) {
    const result = series.slice();
    const end = start + values.length;
    if (end > series.length) {
        const endLength = series.length - start;
        const startLength = values.length - endLength;
        result.splice(start, endLength, ...values.slice(0, endLength));
        result.splice(0, startLength, ...values.slice(endLength));
    }
    else {
        result.splice(start, values.length, ...values);
    }
    return result;
}
function loopReverse(series, start, length) {
    const values = loopSlice(series, start, length);
    values.reverse();
    return loopReplace(series, start, values);
}
const BASE_SERIES = [];
for (let i = 0; i <= 255; i++) {
    BASE_SERIES.push(i);
}
function knotHash(input) {
    function knot(series, inputLengths, index, skipSize) {
        let result = series.slice();
        for (let length of inputLengths) {
            result = loopReverse(result, index, length);
            index += length + skipSize;
            skipSize += 1;
            while (index > series.length) {
                index -= series.length;
            }
        }
        return { result, index, skipSize };
    }
    let series = BASE_SERIES.slice();
    let index = 0;
    let skipSize = 0;
    const inputLengths = input.split('').map(c => c.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
    for (let i = 0; i < 64; i++) {
        const results = knot(series, inputLengths, index, skipSize);
        series = results.result;
        index = results.index;
        skipSize = results.skipSize;
    }
    const denseHash = [];
    for (let i = 0; i < 256; i += 16) {
        const subSeries = series.slice(i, i + 16);
        denseHash.push(subSeries.reduce((result, n) => {
            return result ^ n;
        }, 0));
    }
    return denseHash.map(n => {
        const nHex = n.toString(16);
        if (nHex.length < 2) {
            return `0${nHex}`;
        }
        return nHex;
    }).join('');
}
function binaryKnotHash(input) {
    const hex = knotHash(input);
    const chars = hex.split('').map(h => parseInt(h, 16));
    const binary = chars.map(c => c.toString(2)).map(b => b.padStart(4, '0'));
    return binary.join('');
}
function run(inputString) {
    let count = 0;
    const hashes = [];
    for (let i = 0; i < 128; i++) {
        const hash = binaryKnotHash(`${inputString}-${i}`);
        count += (hash.match(/1/g) || []).length;
        hashes.push(hash);
    }
    console.log(count);
    return hashes;
}
function time(func) {
    const start = perf_hooks_1.performance.now();
    const result = func();
    const time = perf_hooks_1.performance.now() - start;
    console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
    console.log('');
    return result;
}
const testHashes = time(() => run('flqrgnkx'));
const hashes = time(() => run('wenycdww'));
function countRegions(hashes) {
    const hashArrays = hashes.map(hash => hash.split(''));
    function floodFill(array, x, y, value) {
        const target = array[x][y];
        function flow(x, y) {
            if (x >= 0 && x < array.length && y >= 0 && y < array[x].length) {
                if (array[x][y] === target) {
                    array[x][y] = value;
                    flow(x - 1, y);
                    flow(x + 1, y);
                    flow(x, y - 1);
                    flow(x, y + 1);
                }
            }
        }
        flow(x, y);
    }
    let groupCount = 0;
    for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
            if (hashArrays[x][y] === '1') {
                groupCount += 1;
                floodFill(hashArrays, x, y, null);
            }
        }
    }
    console.log(groupCount);
}
time(() => countRegions(testHashes));
time(() => countRegions(hashes));
