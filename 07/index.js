const fs = require('fs');
const path = require('path');

const testInputString = fs.readFileSync(path.resolve(__dirname, 'testInput.txt'), 'utf8');
const inputString = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const pattern = /(\w+) \((\d+)\)(?: -> ([\w, ]+))?/
function parseLine(line) {
  const m = pattern.exec(line);
  return {
    name: m[1],
    weight: +m[2],
    children: m[3] ?
      m[3].split(', ') :
      []
  }
}

const testInput = testInputString.split('\n').map(parseLine);
const input = inputString.split('\n').map(parseLine);

function hasChildren(item) {
  return item.children.length > 0;
}

function findBottom(input) {
  const allChildren = new Set([].concat(...input.map(item => item.children)));
  const bottom = input.find(item => {
    return hasChildren(item)
      && !allChildren.has(item.name);
  });
  return bottom;
}

console.log(findBottom(testInput));
console.log(findBottom(input));

function findUnbalanced(input) {

  const mappedInput = input.reduce((items, item) => Object.assign({}, items, {[item.name]: item}), {});

  function getTotalWeight(name) {
    return mappedInput[name].weight + mappedInput[name].children.reduce((total, child) => total + getTotalWeight(child), 0);
  }

  function testWeight(name) {
    if (!mappedInput[name].children.every(child => testWeight(child))) {
      return false;
    }

    const childWeights = mappedInput[name].children.map(child => ({ name: child, weight: getTotalWeight(child) }));
    if (new Set(childWeights.map(child => child.weight)).size > 1) {
      console.log(`Mismatched child weights at ${name}: ${JSON.stringify(childWeights)}`);
      console.log('Children:');
      mappedInput[name].children.forEach(child => console.log(`${child}: ${mappedInput[child].weight} => ${JSON.stringify(mappedInput[child].children.map(getTotalWeight))}`))
      return false;
    }

    return true;
  }

  const bottom = findBottom(input);
  testWeight(bottom.name);

}

findUnbalanced(testInput);
findUnbalanced(input);