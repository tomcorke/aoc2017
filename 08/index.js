const fs = require('fs');
const path = require('path');

const testInputString = fs.readFileSync(path.resolve(__dirname, 'testInput.txt'), 'utf8');
const inputString = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

function parseInputLine(line) {
  const pattern = /(\w+) (\w+) (-?\d+) if (\w+) (\S+) (-?\d+)/
  const m = pattern.exec(line);
  return {
    line: line,
    register: m[1],
    instruction: m[2],
    value: +m[3],
    ifRegister: m[4],
    ifExpression: m[5],
    ifValue: +m[6]
  }
}

function parseInput(inputString) {
  return inputString.split('\n').map(parseInputLine);
}

const instructions = {
  inc: (r, k, v) => r[k] = r[k] !== undefined ? r[k] + v : v,
  dec: (r, k, v) => r[k] = r[k] !== undefined ? r[k] - v : -v,
}

function getHighestValue(register) {
  let maxKey = undefined;
  let maxValue = undefined;
  Object.keys(register).forEach(key => {
    if (maxKey === undefined || register[key] > maxValue) {
      maxKey = key;
      maxValue = register[key];
    }
  });
  const max = { key: maxKey, value: maxValue }
  return max;
}

function run(input) {
  const register = {};
  let max = undefined;
  input.forEach(line => {
    const ifRegisterValue = register[line.ifRegister] ? register[line.ifRegister] : 0;
    const expr = `${ifRegisterValue} ${line.ifExpression} ${line.ifValue}`;
    if (eval(expr)) {
      instructions[line.instruction](register, line.register, line.value);
    }
    const newMax = getHighestValue(register);
    if (newMax.key && (max === undefined || newMax.value > max.value)) {
      max = newMax;
    }
  });
  return { register, max };
}

const testInput = parseInput(testInputString);
const testResult = run(testInput);
console.log('highest in register:', getHighestValue(testResult.register))
console.log('max during process:', testResult.max);

const input = parseInput(inputString);
const result = run(input);
console.log('highest in register:', getHighestValue(result.register));
console.log('max during process:', result.max);