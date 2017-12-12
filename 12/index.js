const fs = require('fs');
const path = require('path');

const testInputString = fs.readFileSync(path.resolve(__dirname, 'testInput.txt'), 'utf8');
const testInput = testInputString.split('\n')

const inputString = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const input = inputString.split('\n');

function parse(input) {
  function parseLine(line) {
    const m = /(\d+) <-> (.+)/.exec(line);
    const node = +m[1];
    const links = m[2].split(',').map(s => +s)
    return { name: node, links };
  }
  const nodes = input.map(parseLine).reduce((nodes, node) => {
    nodes[node.name] = node;
    return nodes;
  }, {});
  return nodes;
}

function getLinkedToNode(nodes = {}, name = 0, linked = []) {
  if (nodes[name] && nodes[name].links) {
    return Array.from(new Set(nodes[name].links.reduce((links, link) => {
      if (!links.includes(link)) {
        links.push(link);
        return Array.from(new Set(links.concat(getLinkedToNode(nodes, link, links))));
      }
      return links;
    }, linked)))
  }
  return linked;
}

const testGraph = parse(testInput);
const testLinked = getLinkedToNode(testGraph);
console.log(testLinked, '=>', testLinked.length);

const graph = parse(input);
const linked = getLinkedToNode(graph);
console.log('result', linked.length);

function countGroups(nodes) {
  const groups = [];
  return Object.keys(nodes).reduce((groupCount, name) => {
    if (!groups.some(group => group.includes(+name))) {
      const linked = getLinkedToNode(nodes, name);
      groups.push(linked);
      console.log('counting group from', name, linked.length);
      return groupCount + 1;
    }
    return groupCount;
  }, 0);
}

console.log(countGroups(graph));