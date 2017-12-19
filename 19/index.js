const { readFile } = require('../util');

const testInputString = readFile('19/testInput.txt');
const inputString = readFile('19/input.txt');

const testInput = testInputString.split('\n').map(line => line.split('').map(c => c.trim()));
const input = inputString.split('\n').map(line => line.split('').map(c => c.trim()));

const MOVES = {
  n: [-1, 0],
  s: [1, 0],
  e: [0, 1],
  w: [0, -1],
}

function findStart(input) {
  const x = input[0].indexOf('|');
  return [0, x];
}

function run(input) {
  let position = findStart(input);
  let direction = 's';

  function canMove(d) {
    const c = input[position[0] + MOVES[d][0]][position[1] + MOVES[d][1]];
    return !!c;
  }

  function turn() {
    if (direction == 'n' || direction == 's') {
      direction = canMove('e') ? 'e' : 'w';
    } else {
      direction = canMove('n') ? 'n' : 's';
    }
  }

  function move() {
    position[0] += MOVES[direction][0];
    position[1] += MOVES[direction][1];
  }

  function isInBounds() {
    return position[0] >= 0
      && position[0] < input.length
      && position[1] >= 0
      && position[1] < input[0].length
  }

  function charAtPosition() {
    return input[position[0]][position[1]];
  }

  let recorded = [];
  let steps = 0;

  while (true) {
    move();
    steps += 1;
    const c = charAtPosition();

    if (c === '') {
      console.log(`No input char at ${position[1]},${position[0]}: ("${c}")`);
      console.log(`Recorded letters: ${recorded.join('')}`);
      break;
    }

    if (c === '+') {
      console.log(`Turn at ${position[1]},${position[0]}, moving ${direction}`);
      turn();
      console.log(`Now moving ${direction}`);
    }
    if (/[A-Z]/.test(c)) {
      recorded.push(c);
    }
  }

  console.log(recorded.join(''));
  console.log(steps);
}

run(input);