const fs = require('fs');
const path = require('path');

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

  let i = 0;
  let steps = 0;

  while(i >= 0 && i < series.length) {

    const instruction = series[i];

    const newI = i + instruction;
    const newInstruction = modFunction(instruction);

    // console.log(i, instruction, newInstruction);

    series[i] = newInstruction;
    i = newI;

    steps+=1;

  }

  console.log(steps);

}

run(input, strangeIncrement);