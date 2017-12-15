import { time } from '../util';
import { knotHash } from './knotHash';

function binaryKnotHash(input: string) {
  const hex = knotHash(input);
  const chars = hex.split('').map(h => parseInt(h, 16));
  const binary = chars.map(c => c.toString(2)).map(b => b.padStart(4, '0'))
  return binary.join('');
}

function run(inputString: string) {
  let count = 0;
  const hashes = [];
  for (let i = 0; i < 128; i++) {
    const hash = binaryKnotHash(`${inputString}-${i}`)
    count += (hash.match(/1/g) || []).length;
    hashes.push(hash);
  }
  console.log(`1 count: ${count}`);
  return hashes;
}

const testHashes = time(() => run('flqrgnkx'));
const hashes = time(() => run('wenycdww'));

function countRegions(hashes: string[]) {
  const hashArrays: any[][] = hashes.map(hash => hash.split(''))

  function floodFill<T>(array: T[][], x: number, y: number, value: T) {
    const target = array[x][y];

    function flow(x: number, y: number) {
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
        floodFill(hashArrays, x, y, null)
      }

    }
  }

  console.log(`Group count: ${groupCount}`);
}

time(() => countRegions(testHashes));
time(() => countRegions(hashes));
