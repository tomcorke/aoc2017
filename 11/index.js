const fs = require('fs');
const path = require('path');

const moves = {
  nw: (c) => ({ x: c.x - 1, y: c.y + 1 }),
  n : (c) => ({ x: c.x,     y: c.y + 1 }),
  sw: (c) => ({ x: c.x - 1, y: c.y     }),
  ne: (c) => ({ x: c.x + 1, y: c.y     }),
  s : (c) => ({ x: c.x,     y: c.y - 1 }),
  se: (c) => ({ x: c.x + 1, y: c.y - 1 }),
}

const startPosition = { x: 0, y: 0 }

function run(input) {
  let maxDist = 0;
  const result = input.reduce((position, move) => {
    const newPosition = moves[move](position);
    const newDist = dist(newPosition);
    if (newDist > maxDist) { maxDist = newDist; }
    return newPosition;
  }, startPosition);
  return { result, max: maxDist };
}

function sign(n) {
  return n >= 0 ? 1 : -1;
}

function dist(coord) {
  if (sign(coord.x) === sign(coord.y)) {
    return Math.abs(coord.x + coord.y);
  }
  return Math.max(Math.abs(coord.x), Math.abs(coord.y))
}

const testInputStrings = [
  'ne,ne,ne',
  'ne,ne,sw,sw',
  'ne,ne,s,s',
  'se,sw,se,sw,sw'
]

testInputStrings.forEach(inputString => {
  const input = inputString.split(',');
  const { result } = run(input);
  const resultDist = dist(result);
  console.log(input, result, resultDist);
});

const inputString = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const input = inputString.split(',');

const { result, max } = run(input);
const resultDist = dist(result);

console.log(result, resultDist, max);