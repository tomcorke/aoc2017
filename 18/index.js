const { readFile } = require('../util');

function parse(line) {
  const m = /(\w{3}) (\S+)(?: (.+))?$/.exec(line);
  return {
    cmd: m[1],
    a: m[2],
    b: m[3]
  }
}

function run(input) {
  const registers = {};
  let pointer = 0;
  let lastSound = 0;

  function isNumeric(v) {
    return !isNaN(v);
  }

  function getValue(v) {
    if (isNumeric(v)) {
      return +v;
    } else {
      return registers[v] || 0;
    }
  }

  function runCmd(cmd) {
    const newPointer = ({
      snd: (a) => {
        console.log(`sound - freq: ${getValue(a)}`);
        lastSound = getValue(a);
      },
      set: (a, b) => {
        registers[a] = getValue(b);
      },
      add: (a, b) => {
        registers[a] += getValue(b);
      },
      mul: (a, b) => {
        registers[a] *= getValue(b);
      },
      mod: (a, b) => {
        registers[a] = registers[a] % getValue(b);
      },
      rcv: (a) => {
        if (getValue(a) !== 0) {
          console.log('recover', lastSound);
          lastSound = 4;
          return 1000;
        }
      },
      jgz: (a, b) => {
        if (getValue(a) > 0) {
          return pointer + getValue(b);
        }
      },
    })[cmd.cmd].call(null, cmd.a, cmd.b);
    return newPointer !== undefined ? newPointer : pointer + 1;
  }

  while (pointer >= 0 && pointer < input.length) {
    const cmd = input[pointer];
    console.log(pointer, cmd.cmd, cmd.a, getValue(cmd.a), cmd.b, getValue(cmd.b));
    pointer = runCmd(cmd);
  }
}


const testInput = readFile('18/testInput.txt').split('\n').map(parse);
const input = readFile('18/input.txt').split('\n').map(parse);

// run(testInput);

run(input);