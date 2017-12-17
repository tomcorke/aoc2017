
function spinlock(initialBuffer, input, iterations = 2017) {
    let buffer = initialBuffer.slice();
    
    let position = 0;

    function spin(n) {
        position = ((position + input) % n) + 1
        if (position == 1) { console.log(`Insert at position 1: ${n}`); }
        // buffer.splice(position, 0, n);
    }

    for(let i = 1; i <= iterations; i++) {
        spin(i);
    }

    console.log(buffer[position + 1]);
    console.log(buffer[1]);
}

spinlock([0], 356, 50000000);
