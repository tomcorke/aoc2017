function loopSlice(series = [], start, length) {
    const end = start + length;
    if (end > series.length) {
        return series.slice(start, series.length).concat(series.slice(0, end - series.length));
    } else {
        return series.slice(start, end);
    }
}

function loopReplace(series, start, values) {
    const result = series.slice();
    const end  = start + values.length;
    if (end > series.length) {
        const endLength = series.length - start;
        const startLength = values.length - endLength;
        result.splice(start, endLength, ...values.slice(0, endLength));
        result.splice(0, startLength, ...values.slice(endLength));
    } else {
        result.splice(start, values.length, ...values);
    }
    return result;
}

function loopReverse(series, start, length) {
    const values = loopSlice(series, start, length);
    values.reverse();
    return loopReplace(series, start, values);
}

function run(series, input, startPosition = 0, skipSize = 0) {
    let index = startPosition;
    let result = series.slice();
    for (let length of input) {
        result = loopReverse(result, index, length);
        index += length + skipSize;
        skipSize += 1;
        while (index > series.length) {
            index -= series.length;
        }
    }
    return { result, index, skipSize }
}

const testResults = run([0, 1, 2, 3, 4], [3, 4, 1, 5]);
console.log('example', testResults.result[0] * testResults.result[1]);

const inputString = '183,0,31,146,254,240,223,150,2,206,161,1,255,232,199,88';
const input = inputString.split(',').map(x => +x);

const BASE_SERIES = [];
for (let i = 0; i <= 255; i++) {
    BASE_SERIES.push(i);
}

const results = run(BASE_SERIES.slice(), input);
const result = results.result;
console.log('part 1:', result[0] * result[1])

function runPart2(inputString) {

    const salt = [17,31,73,47,23];
    function inputFromAscii(string) {
        return string.split('').map(char => char.charCodeAt(0));
    }
    const input = inputFromAscii(inputString).concat(salt);
    let series = BASE_SERIES.slice();
    let startPosition = 0;
    let skipSize = 0;

    for(let i = 0; i < 64; i++) {
        const results = run(series, input, startPosition, skipSize);
        series = results.result;
        startPosition = results.index;
        skipSize = results.skipSize;
    }
    const denseHash = [];
    for (let i = 0; i < 256; i += 16) {
        const subSeries = series.slice(i, i + 16);
        denseHash.push(subSeries.reduce((result, n) => {
            return result ^ n;
        }, 0));
    }

    function toHex2(n) {
        const hex = n.toString(16);
        if (hex.length < 2) {
            return `0${hex}`;
        }
        return hex;
    }

    const denseHashString = denseHash.map(toHex2).join('');
    console.log(denseHashString);
}

runPart2('');
runPart2('AoC 2017');

runPart2(inputString);