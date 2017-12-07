const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const testInputString = `0
3
0
1
-3`;

const testInput = testInputString.split('\n').map(a => +a);

const inputString = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const input = inputString.split('\n').map(a => +a);

function increment(value) {
  return value + 1;
}

function strangeIncrement(value) {
  if (value >= 3) {
    return value - 1;
  }
  return value + 1;
}

function run(series, modFunction = increment) {

  console.log('Running...');
  const start = performance.now();

  let index = 0;
  let steps = 0;

  while(index >= 0 && index < series.length) {

    const instruction = series[index];

    const newIndex = index + instruction;
    const newInstruction = modFunction(instruction);

    series[index] = newInstruction;
    index = newIndex;

    steps += 1;

  }

  const end = performance.now();

  const time = Math.floor((end - start) * 10) / 10;

  console.log(steps, 'steps');
  console.log('took', time, 'ms');

}

run(input, strangeIncrement);