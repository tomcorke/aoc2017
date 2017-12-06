
function arraysEqual(a, b) {
  if (a === b) { return true; }
  if (a === null || b === null) { return false; }
  if (a.length !== b.length) { return false; }
  return a.every((item, index) => b[index] == item);
}

function spreadHighest(series) {
  let s = series.slice();
  const max = Math.max(...s);

  let i = s.indexOf(max);
  let toSpread = max;
  s[i] = 0;

  while (toSpread > 0) {
    i += 1;
    if (i >= s.length) { i = 0; }
    toSpread -= 1;
    s[i] += 1;
  }
  // console.log(series, '=>', s);
  return s;
}

function run(series, func = spreadHighest) {

  let iterations = 0;

  const history = [];

  while(!history.some(item => arraysEqual(series, item))) {
    iterations += 1;
    // console.log('Iteration', iterations, series);
    history.push(series.slice());
    series = func(series);
  }

  console.log(`${iterations} iterations complete.`);
  return series;

}

function runTwice(series, func) {
  const s = run(series, func);
  const s2 = run(s, func);
}

run([0, 2, 7, 0]);
runTwice([11, 11, 13, 7, 0, 15, 5, 5, 4, 4, 1, 1, 7, 1, 15, 11]);