import { performance } from 'perf_hooks';

const testInputStrings = `0: 3
1: 2
4: 4
6: 4`.split('\n');

class Layer {
  depth: number;
  range: number;
  phase: number;
  scanIndex: number;
  scanDirection: number;

  constructor(depth: number, range: number) {
    this.depth = depth;
    this.range = range;
    this.phase = range * 2 - 1;
    this.reset();
  }
  reset() {
    this.scanIndex = 0;
    this.scanDirection = 1;
  }
  scan() {
    this.scanIndex += this.scanDirection;
    if (this.scanIndex >= this.range - 1 || this.scanIndex === 0) {
      this.scanDirection = 0 - this.scanDirection;
    }
    return this.scanIndex;
  }
}

type LayerMap = {
  [depth: number]: Layer
}

function parse(input: string[]) {
  const pattern = /(\d+): (\d+)/;
  return input
    .reduce((layers: LayerMap, line) => {
      const m = pattern.exec(line);
      const depth: string = m![1];
      const range: string = m![2];
      layers[+depth] = new Layer(+depth, +range);
      return layers;
    }, {});
}

function run(layers: LayerMap) {

  const layerArray = Object.keys(layers).map(k => layers[+k]);

  const maxDepth = Math.max(...layerArray.map(l => l.depth));

  layerArray.forEach(layer => layer.reset());

  let severity = null;

  for (let l = 0; l <= maxDepth; l++) {
    if (layers[l] && layers[l].scanIndex === 0) {
      console.log(`Caught on layer ${l}, severity: ${l * layers[l].range}`);
      severity = (severity || 0) + l * layers[l].range;
    }
    layerArray.forEach(layer => layer.scan());
  }

  console.log(`Total severity: ${severity}`);
  console.log('');

  return severity;
}

function findDelay(layers: LayerMap) {

  const layerArray = Object.keys(layers).map(k => layers[+k]);

  let delay = -1;
  let caught = true;

  do {
    delay += 1;
    caught = layerArray.some(layer => {
      return (delay + layer.depth) % (layer.phase - 1) === 0;
    });
  } while (caught == true);

  console.log(`Passed with delay ${delay}`);
}

const testInput = parse(testInputStrings);
run(testInput);

const inputStrings = `0: 5
1: 2
2: 3
4: 4
6: 6
8: 4
10: 8
12: 6
14: 6
16: 8
18: 6
20: 9
22: 8
24: 10
26: 8
28: 8
30: 12
32: 8
34: 12
36: 10
38: 12
40: 12
42: 12
44: 12
46: 12
48: 14
50: 12
52: 14
54: 12
56: 14
58: 12
60: 14
62: 14
64: 14
66: 14
68: 14
70: 14
72: 14
76: 14
80: 18
84: 14
90: 18
92: 17`.split('\n');

const input = parse(inputStrings);
run(input);

// Part 2

findDelay(testInput);

const start = performance.now();
findDelay(input);
const end = performance.now();
const time = end - start;
console.log(`Time to calc: ${Math.floor(time * 10) / 10}ms`);