import { performance } from 'perf_hooks';

const testInputStrings = `0: 3
1: 2
4: 4
6: 4`.split('\n');

class Layer {
  depth: number;
  range: number;
  phase: number;

  constructor(depth: number, range: number) {
    this.depth = depth;
    this.range = range;
    this.phase = range * 2 - 1;
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

  let isCaught = false;
  const severity = layerArray.reduce((severity, layer) => {
    if (layer.depth % (layer.phase - 1) === 0) {
      isCaught = true;
      const layerSeverity = layer.depth * layer.range;
      return severity + layerSeverity;
    }
    return severity;
  }, 0);

  if (isCaught) {
    console.log(`Total severity: ${severity}`);
  } else {
    console.log('Not caught');
  }

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


function time(func: Function) {
  const start = performance.now();
  func();
  const time = performance.now() - start;
  console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
  console.log('');
}

const input = parse(inputStrings);
time(() => run(input));

// Part 2

findDelay(testInput);

const start = performance.now();
time(() => findDelay(input));