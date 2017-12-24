let a = 1;

let nonPrimes = 0

let startn = 0;
let max = 0;

if (a != 0) {
  startn = 99 * 100 + 100000
  max = startn + 17000
} else {
  startn = 99
  max = 99
}

for (let n = startn; n <= max; n += 17) {

  let isPrime = true

  for (let x = 2; x < n; x++) {

    if (n % x == 0) {
      isPrime = false
      break;
    }

  }

  if (isPrime == false) {
    nonPrimes += 1
  }

}

console.log(nonPrimes);