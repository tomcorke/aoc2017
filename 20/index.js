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
}

class Particle {
    constructor(index, position, velocity, acceleration) {
        this.index = index;
        this.p = position;
        this.v = velocity;
        this.a = acceleration;
        this.minimumDist = this.p.magnitude;
        this.movedCloser = false;
    }
    move() {
        this.v = this.v.add(this.a);
        this.p = this.p.add(this.v);
        const dist = this.p.magnitude;
        if (dist <= this.minimumDist) {
            this.minimumDist = dist;
            this.movedCloser = true;
        } else {
            this.movedCloser = false;
        }
    }
}

function parse(line, index) {
    const pattern = /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/
    const m = pattern.exec(line);
    return new Particle(
        index,
        new Vector(m[1], m[2], m[3]),
        new Vector(m[4], m[5], m[6]),
        new Vector(m[5], m[6], m[7]),
    );
}

const input = readFile('20/input.txt').split('\n').map(parse);

function sign(n) {
    return n < 0 ? -1 : 1;
}

function run(input) {
    
/*
    while (!input.every(particle => !particle.movedCloser)) {
        input.forEach(particle => particle.move());
    }
*/

    console.log(Math.min(...input.map(p => p.index)), Math.max(...input.map(p => p.index)));

    const sortedByMinimumDistance = input.sort((a, b) => a.minimumDist - b.minimumDist);
    const closest = sortedByMinimumDistance[0];
    
    const sortedByAcceleration = input.sort((a, b) => a.a.magnitude - b.a.magnitude);
    const slowestAcceleration = sortedByAcceleration[0].a.magnitude;

    const jointSlowestAcceleration = input.filter(p => p.a.magnitude === slowestAcceleration);
    const slowestSlowest = jointSlowestAcceleration.sort((a, b) => a.v.magnitude - b.v.magnitude);
    const slowestAccelerationVelocity = slowestSlowest[0].v.magnitude;

    const jointSlowestAccelerationVelocity = input.filter(p => p.v.magnitude === slowestAccelerationVelocity);
    const slowestSlowestClosest = jointSlowestAccelerationVelocity.sort((a, b) => a.p.magnitude - b.p.magnitude);
    

    console.log(sortedByAcceleration.slice(0, 5));
}

run(input);