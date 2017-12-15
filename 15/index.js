"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
function* generator(seed, factor, options = { picky: false }) {
    let n = seed;
    function next(n) {
        return (n * factor) % 2147483647;
    }
    do {
        do {
            n = next(n);
        } while (options.picky && n % options.pickMultiple !== 0);
        yield n;
    } while (true);
}
function run(startValueA, startValueB, generatorOptionsA = { picky: false }, generatorOptionsB = { picky: false }, cycles = 40000000) {
    const genA = generator(startValueA, 16807, generatorOptionsA);
    const genB = generator(startValueB, 48271, generatorOptionsB);
    let matchCount = 0;
    console.log(`Inputs: (${startValueA}, ${startValueB})`);
    for (let i = 0; i < cycles; i++) {
        const valueA = genA.next().value;
        const valueB = genB.next().value;
        if (i % 1000000 === 0) {
            console.log(`Iterations: ${i}..`);
        }
        const binaryA = valueA.toString(2).substr(-16).padStart(16, '0');
        const binaryB = valueB.toString(2).substr(-16).padStart(16, '0');
        if (binaryA === binaryB) {
            matchCount += 1;
        }
    }
    console.log(`Matches: ${matchCount}`);
}
function time(func) {
    const start = perf_hooks_1.performance.now();
    const result = func();
    const time = perf_hooks_1.performance.now() - start;
    console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
    console.log('');
    return result;
}
// time(() => run(65, 8921));
/*
time(() => run(65, 8921,
  { picky: true, pickMultiple: 4 },
  { picky: true, pickMultiple: 8 },));
*/
time(() => run(512, 191, { picky: true, pickMultiple: 4 }, { picky: true, pickMultiple: 8 }, 5000000));
