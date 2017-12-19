const { readFile } = require('../util');

type Cmd = {
  cmd: string,
  a: string,
  b?: string,
}

function parse(line: string): Cmd {
  const m = /(\w{3}) (\S+)(?: (.+))?$/.exec(line);
  return {
    cmd: m && m[1] || '',
    a: m && m[2] || '',
    b: m && m[3] || undefined
  }
}

function run(input: Cmd[]) {

  function isNumeric(v: any) {
    return !isNaN(v);
  }

  const messageQueue: number[][] = [[], []];
  const messagesSent: number[] = [0, 0];
  const messagesReceived: number[] = [0, 0];
  let programsWaiting = 0;

  async function runProgram(id: number) {

    const registers: {
      [key: string]: number
    } = {
      p: id
    };
    let pointer = 0;

    function getValue(v: string | undefined) {
      if (v === undefined) {
        return 0;
      }
      if (isNumeric(v)) {
        return +v;
      } else {
        return registers[v] || 0;
      }
    }

    async function receiveValue(): Promise<number> {
      return new Promise<number>((resolve, reject) => {
        programsWaiting += 1;
        console.log(`Program ${id} waiting for message (${programsWaiting} waiting)`);

        function tryReceive() {

          const message = messageQueue[1 - id].shift();
          if (message !== undefined) {
            programsWaiting -= 1;
            messagesReceived[id] += 1;
            console.log(`Program ${id} got message ${message} (${messagesReceived[id]})`);
            return resolve(message);
          } else if (programsWaiting === 2) {
            return reject('Deadlock!');
          }

          setTimeout(tryReceive, 1);
        }

        tryReceive();
      });
    }

    async function runCmd(cmd: Cmd) {
      const cmdMap: {
        [key: string]: (a: string, b?: string) => (Promise<any> | number | void)
      } = {
        snd: (a) => {
          messageQueue[id].push(getValue(a));
          messagesSent[id] += 1;
          console.log(`Program ${id} sent message ${getValue(a)} (${messagesSent[id]})`);
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
        rcv: async (a) => {
          registers[a] = await receiveValue();
        },
        jgz: (a, b) => {
          if (getValue(a) > 0) {
            return pointer + getValue(b);
          }
        },
      };
      const newPointer = await cmdMap[cmd.cmd].call(null, cmd.a, cmd.b);
      await new Promise(resolve => setTimeout(resolve, 1));
      return newPointer !== undefined ? newPointer : pointer + 1;
    }

    while (pointer >= 0 && pointer < input.length) {
      const cmd = input[pointer];
      // console.log(id, pointer, cmd.cmd, cmd.a, getValue(cmd.a), cmd.b, getValue(cmd.b));
      pointer = await runCmd(cmd);
    }

    throw `Program ${id} pointer out of bounds: ${pointer}`;
  }

  Promise.all([
    runProgram(0),
    runProgram(1),
  ])
  .catch(err => {
    console.error(err);
    console.log(messagesSent);
  });
}


const testInput = readFile('18/testInput2.txt').split('\n').map(parse);
const input = readFile('18/input.txt').split('\n').map(parse);

// run(testInput);
run(input);