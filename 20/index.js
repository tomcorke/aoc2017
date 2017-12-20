const { readFile } = require('../util');

class Vector {
    constructor(x, y, z) {
        this.x = +x;
        this.y = +y;
        this.z = +z;
    }
    get magnitude() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    add(v) {
        return new Vector(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }
    equals(v) {
        return this.x === v.x
             && this.y === v.y
             && this.z === v.z;
    }
}

class Particle {
    constructor(index, position, velocity, acceleration) {
        this.index = index;
        this.p = position;
        this.v = velocity;
        this.a = acceleration;
        this.minimumDist = this.p.magnitude;
        this.movingCloser = true;
    }
    move() {
        this.v = this.v.add(this.a);
        this.p = this.p.add(this.v);
        const dist = this.p.magnitude;
        if (dist <= this.minimumDist) {
            this.minimumDist = dist;
            this.movingCloser = true;
        } else if (this.p.add(this.v.add(this.a)).magnitude < dist) {
            this.movingCloser = true;
        } else {
            this.movingCloser = false;
        }
    }
}

function parse(line, index) {
    const pattern = /p=<\s?(-?\d+),\s?(-?\d+),\s?(-?\d+)>, v=<\s?(-?\d+),\s?(-?\d+),\s?(-?\d+)>, a=<\s?(-?\d+),\s?(-?\d+),\s?(-?\d+)>/
    const m = pattern.exec(line);
    return new Particle(
        index,
        new Vector(m[1], m[2], m[3]),
        new Vector(m[4], m[5], m[6]),
        new Vector(m[7], m[8], m[9]),
    );
}

function sign(n) {
    return n < 0 ? -1 : 1;
}

function part1(input) {
    const slowest = input.sort((a, b) => a.a.magnitude - b.a.magnitude);
    console.log('Slowest particle:', slowest[0]);
}

function part2(input) {
    input.filter(particle => !input.some(other => particle.index != other.index && particle.p.equals(other.p)));
    while (!input.every(particle => !particle.movingCloser)) {
        input.forEach(particle => particle.move());
        input = input.filter(particle => !input.some(other => particle.index != other.index && particle.p.equals(other.p)));
    }
    console.log(`Particles remaining: ${input.length}`);
}

const testInput = readFile('20/testInput.txt').split('\n').map(parse);
part1(testInput);

const testInput2 = readFile('20/testInput2.txt').split('\n').map(parse);
part2(testInput2);

const input = readFile('20/input.txt').split('\n').map(parse);
part1(input);
part2(input);