import { performance } from 'perf_hooks';

interface NonPickyGeneratorOptions {
  picky: false;
}
interface PickyGeneratorOptions {
  picky: true;
  pickMultiple: number;
}
type GeneratorOptions = NonPickyGeneratorOptions | PickyGeneratorOptions;

function* generator(seed: number, factor: number, options: GeneratorOptions = { picky: false }) {
  let n = seed;

  function next(n: number) {
    return (n * factor) % 2147483647;
  }

  do {
    do {
      n = next(n);
    } while (options.picky && n % options.pickMultiple !== 0)
    yield n;
  } while (true)
}

function run(
  startValueA: number,
  startValueB: number,
  generatorOptionsA: GeneratorOptions = { picky: false },
  generatorOptionsB: GeneratorOptions = { picky: false },
  cycles = 40000000
){

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
    const binaryA = valueA & 65535;
    const binaryB = valueB & 65535;

    if (binaryA === binaryB) {
      matchCount += 1;
    }
  }

  console.log(`Matches: ${matchCount}`);
}

function time(func: Function) {
  const start = performance.now();
  const result = func();
  const time = performance.now() - start;
  console.log(`Time: ${Math.floor(time * 10) / 10}ms`);
  console.log('');
  return result;
}

// time(() => run(65, 8921));

time(() => run(512, 191))

/*
time(() => run(65, 8921,
  { picky: true, pickMultiple: 4 },
  { picky: true, pickMultiple: 8 },));
*/

time(() => run(512, 191,
  { picky: true, pickMultiple: 4 },
  { picky: true, pickMultiple: 8 },
  5000000,
));