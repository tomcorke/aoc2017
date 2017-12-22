"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { readFile } = require('../util');
function parse(line) {
    const m = /(\w{3}) (\S+)(?: (.+))?$/.exec(line);
    return {
        cmd: m && m[1] || '',
        a: m && m[2] || '',
        b: m && m[3] || undefined
    };
}
function run(input) {
    function isNumeric(v) {
        return !isNaN(v);
    }
    const messageQueue = [[], []];
    const messagesSent = [0, 0];
    const messagesReceived = [0, 0];
    let programsWaiting = 0;
    function runProgram(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const registers = {
                p: id
            };
            let pointer = 0;
            function getValue(v) {
                if (v === undefined) {
                    return 0;
                }
                if (isNumeric(v)) {
                    return +v;
                }
                else {
                    return registers[v] || 0;
                }
            }
            function receiveValue() {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => {
                        programsWaiting += 1;
                        console.log(`Program ${id} waiting for message (${programsWaiting} waiting)`);
                        function tryReceive() {
                            const message = messageQueue[1 - id].shift();
                            if (message !== undefined) {
                                programsWaiting -= 1;
                                messagesReceived[id] += 1;
                                console.log(`Program ${id} got message ${message} (${messagesReceived[id]})`);
                                return resolve(message);
                            }
                            else if (programsWaiting === 2) {
                                return reject('Deadlock!');
                            }
                            setTimeout(tryReceive, 1);
                        }
                        tryReceive();
                    });
                });
            }
            function runCmd(cmd) {
                return __awaiter(this, void 0, void 0, function* () {
                    const cmdMap = {
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
                        rcv: (a) => __awaiter(this, void 0, void 0, function* () {
                            registers[a] = yield receiveValue();
                        }),
                        jgz: (a, b) => {
                            if (getValue(a) > 0) {
                                return pointer + getValue(b);
                            }
                        },
                    };
                    const newPointer = yield cmdMap[cmd.cmd].call(null, cmd.a, cmd.b);
                    yield new Promise(resolve => setTimeout(resolve, 1));
                    return newPointer !== undefined ? newPointer : pointer + 1;
                });
            }
            while (pointer >= 0 && pointer < input.length) {
                const cmd = input[pointer];
                // console.log(id, pointer, cmd.cmd, cmd.a, getValue(cmd.a), cmd.b, getValue(cmd.b));
                pointer = yield runCmd(cmd);
            }
            throw `Program ${id} pointer out of bounds: ${pointer}`;
        });
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
