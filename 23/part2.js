let a = 0;
let n = 0;
let max = 0;
let x = 0
let y = 0
let g = 0

let countPrimes = 0

let startn = 0;

if (a != 0) {
  startn = 99 * 100 + 100000
  max = startn + 17000
  console.log(startn, max)
} else {
  startn = 97
  max = 200
}

for (let n = startn; n < max; n += 17) {

  let isPrime = true

  outer_loop:

  for (x = 2; x < n; x++) {

    for(y = 2; y < n; y++) {

      if (x * y == n) {
        isPrime = false
        break outer_loop;
      }

    }

  }

  if (isPrime == true) {
    countPrimes += 1
  }

}

console.log(countPrimes);