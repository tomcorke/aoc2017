const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

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

  const start = performance.now();

  const mappedInput = input.reduce((items, item) => Object.assign({}, items, {[item.name]: item}), {});

  function getTotalWeight(name) {
    const item = mappedInput[name];
    if (item.totalWeight) { return item.totalWeight; }
    const totalWeight = item.weight + item.children.reduce((total, child) => total + getTotalWeight(child), 0);
    item.totalWeight = totalWeight;
    return totalWeight;
  }

  function testWeight(name) {
    if (mappedInput[name].children.some(child => !testWeight(child))) {
      return false;
    }

    const childWeights = mappedInput[name].children.map(child => ({ name: child, weight: getTotalWeight(child) }));
    if (new Set(childWeights.map(child => child.weight)).size > 1) {
      console.log(`Mismatched child weights at ${name}`);
      console.log('Children:');
      mappedInput[name].children.forEach(child => console.log(`${child} (${childWeights.find(cw => cw.name === child).weight}): ${mappedInput[child].weight} => ${JSON.stringify(mappedInput[child].children.map(getTotalWeight))}`))
      return false;
    }
1
    return true;
  }

  const bottom = findBottom(input);
  testWeight(bottom.name);

  const end = performance.now();
  const duration = Math.floor((end - start) * 10) / 10;

  console.log(`Time taken: ${duration}ms`);

}

findUnbalanced(testInput);
findUnbalanced(input);