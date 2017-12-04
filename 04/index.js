const path = require('path');
const fs = require('fs');

const inputs = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8').split('\n');

const testInputs = [
  'aa bb cc dd ee',
  'aa bb cc dd aa',
  'aa bb cc dd aaa'
];

function uniqueWordFilter(parts) {
  return parts.every((part, index) => {
    return parts.indexOf(part, index + 1) == -1;
  });
}

function isValidPhrase(phrase, filterFunc = uniqueWordFilter) {
  const parts = phrase.split(' ');
  return filterFunc(parts);
}

const validPhrases = inputs.filter(phrase => isValidPhrase(phrase));

console.log('part 1:', validPhrases.length);

function anagramFilter(parts) {
  return parts.every((part, index) => {
    const partsCopy = parts.slice();
    partsCopy.splice(index,1)
    return partsCopy.every(otherPart => {
      const first = part.split('').sort().join('');
      const second = otherPart.split('').sort().join('');
      return first != second;
    });
  });
}

const extraValidPhrases = inputs.filter(phrase => isValidPhrase(phrase, anagramFilter));

console.log('part 2:', extraValidPhrases.length);

