const util = require("../util");

function parse(moveString) {
    const spinPattern = /s(\d+)/;
    const swapPositionPattern = /x(\d+)\/(\d+)/;
    const swapProgramPattern = /p(\w+)\/(\w+)/;
    const move = moveString.substr(0, 1);
    if (move === 's') {
        return {
            move: 'spin',
            args: [+((spinPattern.exec(moveString) || [])[1])],
        };
    }
    else if (move === 'x') {
        const m = swapPositionPattern.exec(moveString) || [];
        return {
            move: 'swapPositions',
            args: [+m[1], +m[2]],
        };
    }
    else if (move === 'p') {
        const m = swapProgramPattern.exec(moveString) || [];
        return {
            move: 'swapPrograms',
            args: [m[1], m[2]],
        };
    }
    throw `Unrecognised input: ${moveString}`;
}

const actions = {
    spin: (programs, [ value ]) => {
        return programs.slice(programs.length - value).concat(programs.slice(0, programs.length - value));
    },
    swapPositions: (programs, [ valueA, valueB ]) => {
        const p = programs.slice();
        p[valueB] = programs[valueA];
        p[valueA] = programs[valueB];
        return p;        
    },
    swapPrograms: (programs, [ valueA, valueB ]) => {
        const p = programs.slice();
        p[programs.indexOf(valueA)] = valueB;
        p[programs.indexOf(valueB)] = valueA;
        return p;
    },
};

function run(programs, input, callback) {
    let programArray = programs.split('');
    input.forEach(move => {
        programArray = actions[move.move](programArray, move.args);
    });
    const result = programArray.join('');
    if (callback) { callback(result); }
    return result;
}

const testInput = util.readFile('16/testInput.txt').split(',').map(parse);
const input = util.readFile('16/input.txt').split(',').map(parse);

const TEST_PROGRAM_START = 'abcde';
const PROGRAM_START = 'abcdefghijklmnop';

run(TEST_PROGRAM_START, testInput, n => console.log(`Test result: ${n}`));
run(PROGRAM_START, input, n => console.log(`Part 1 result: ${n}`));

let programs = PROGRAM_START;
function runRepeat(programs, maxIterations, callback) {
    for(let i = 0; i < maxIterations; i++) {
        if (i > 0 && programs === PROGRAM_START) {
            console.log(`Returned to initial value at iteration: ${i}`);
            console.log(`1 billion iterations == ${1000000000 % i} iterations`);
            runRepeat(PROGRAM_START, 1000000000 % i, n => console.log(`Part 2 result: ${n}`));
            return;
        }
        programs = run(programs, input);
    }
    if (callback) { callback(programs); }
}

runRepeat(PROGRAM_START, 1000000000);