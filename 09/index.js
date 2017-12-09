const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const groupTests = {
  '{}': 1,
  '{{{}}}': 3,
  '{{},{}}': 3,
  '{{{},{},{{}}}}': 6,
  '{<{},{},{{}}>}': 1,
  '{<a>,<a>,<a>,<a>}': 1,
  '{{<a>},{<a>},{<a>},{<a>}}': 5,
  '{{<!>},{<!>},{<!>},{<a>}}': 2,
};
const sumTests = {
  '{}': 1,
  '{{{}}}': 6,
  '{{},{}}': 5,
  '{{{},{},{{}}}}': 16,
  '{<a>,<a>,<a>,<a>}': 1,
  '{{<ab>},{<ab>},{<ab>},{<ab>}}': 9,
  '{{<!!>},{<!!>},{<!!>},{<!!>}}': 9,
  '{{<a!>},{<a!>},{<a!>},{<ab>}}': 3,
};

function stripNegated(input) {
  const negatedPattern = /!./g
  let result = input;
  while (negatedPattern.test(result)) {
    result = result.replace(negatedPattern, '');
  }
  // console.log('after negate', result);
  return result;
}

function stripGarbageContents(input) {
  const garbagePattern = /<[^>]+>/g
  const result =  input.replace(garbagePattern, '<>');
  // console.log('after strip contents', result);
  return result;
}

function stripGarbageTags(input) {
  const garbagePattern = /<>/g
  const result =  input.replace(garbagePattern, '');
  // console.log('after strip tags', result);
  return result;
}

function getTotals(input) {
  let depth = 0;
  let groups = 0;
  let sum = 0;

  for(let i = 0; i < input.length; i++) {
    const char = input.substr(i, 1);
    switch (char) {
      case '{':
        depth += 1;
        break;
      case '}':
        sum += depth;
        depth -= 1;
        groups += 1;
        break;
      case ',':
        break;
      default:
        throw Error(`Unexpected char in ${input}: "${char}"`);
    }
  }
  return {
    groups,
    sum,
  };
}

function parse(input) {

  // console.log('input', input);
  const negatedInput = stripNegated(input);
  const strippedGarbageContentInput = stripGarbageContents(negatedInput);
  const strippedInput = stripGarbageTags(strippedGarbageContentInput);

  const result = getTotals(strippedInput);

  result.garbageCount = negatedInput.length - strippedGarbageContentInput.length;

  return result;

}

Object.keys(groupTests).forEach(key => {
  const expectedGroups = groupTests[key];
  const result = parse(key);
  if (expectedGroups === result.groups) {
    console.log(chalk.green(`Test groups for ${key} is ${result.groups} as expected`));
  } else {
    console.log(chalk.red(`Test groups for ${key} is ${result.groups}, expected ${expectedGroups}`));
  }
});


Object.keys(sumTests).forEach(key => {
  const expectedSum = sumTests[key];
  const result = parse(key);
  if (expectedSum === result.sum) {
    console.log(chalk.green(`Test sum for ${key} is ${result.sum} as expected`));
  } else {
    console.log(chalk.red(`Test sum for ${key} is ${result.sum}, expected ${expectedSum}`));
  }
});

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const result = parse(input);
console.log(result);