const { readFile } = require('../util');

function isNumeric(n) {
  return !isNaN(n);
}

function getInitialRegister() {
  return {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
  }
}

class Tablet {

  constructor(register = null) {
    if (!register) {
      register = getInitialRegister();
    }
    this.register = register;
    this.mulCount = 0;
    this.stateHistory = [];
  }

  parse(line) {
    const m = /(\S+) (\S+) (\S+)/.exec(line);
    return {
      cmd: m[1],
      x: m[2],
      y: m[3],
    };
  }

  getValue(n) {
    if (isNumeric(n)) {
      return +n;
    }
    return this.register[n] !== undefined ? this.register[n] : 0;
  }

  run(input) {

    const cmds = input.map(line => this.parse(line));
    let pointer = 0;

    let i = 0;

    while (pointer >= 0 && pointer < cmds.length) {

      if (i % 100000 === 0) {
        console.log(i);
        console.log(this.register);
      }

      i += 1;

      const cmd = cmds[pointer];
      let newPointer = null;

      switch(cmd.cmd) {
        case 'set':
          this.register[cmd.x] = this.getValue(cmd.y);
          break;
        case 'sub':
          this.register[cmd.x] = this.getValue(cmd.x) - this.getValue(cmd.y);
          break;
        case 'mul':
          this.register[cmd.x] = this.getValue(cmd.y) * this.getValue(cmd.y);
          this.mulCount += 1;
          break;
        case 'jnz':
          if (this.getValue(cmd.x) !== 0) {
            newPointer = pointer + this.getValue(cmd.y);
          }
          break;
        default:
          console.log('Unrecognised command:');
          console.log(cmd);
          newPointer = -1;
      }

      pointer = newPointer !== null ? newPointer : (pointer + 1);

    }

    console.log('Pointer out of bounds!');
    console.log({ mulCount: this.mulCount });
    console.log(this.register);
  }
}

const input = readFile('23/input.txt').split('\n');

new Tablet().run(input);

// new Tablet({ a: 1 }).run(input);