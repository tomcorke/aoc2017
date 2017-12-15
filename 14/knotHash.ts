function loopSlice<T>(series: T[] = [], start: number, length: number) : T[] {
  const end = start + length;
  if (end > series.length) {
      return series.slice(start, series.length).concat(series.slice(0, end - series.length));
  } else {
      return series.slice(start, end);
  }
}

function loopReplace<T>(series: T[], start: number, values: any[]): T[] {
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

function loopReverse<T>(series: T[], start: number, length: number): T[] {
  const values = loopSlice(series, start, length);
  values.reverse();
  return loopReplace(series, start, values);
}

const BASE_SERIES: number[] = [];
for (let i = 0; i <= 255; i++) {
    BASE_SERIES.push(i);
}

function knotHash(input: string) {

  function knot(series: number[], inputLengths: number[], index: number, skipSize: number) {
    let result = series.slice();
    for(let length of inputLengths) {
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

  for(let i = 0; i < 64; i++) {
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

export {
  knotHash
}