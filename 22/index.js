const { readFile } = require('../util');

function parse(textData) {
    const lines = textData.split('\n').map(s => s.trim());
    const w = lines[0].length;
    const h = lines.length;
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    const grid = {};

    function parseLine(line) {
        const l = {};
        for (let x = 0; x < w; x++) {
            const vx = x - cx;
            l[vx] = line.substr(x, 1) === '#' ? 1 : 0;
        }
        return l;
    }

    for (let y = 0; y < h; y++) {
        const vy = y - cy;
        grid[vy] = parseLine(lines[y]);
    }

    return grid;
}

const STATE_CLEAN = 0;
const STATE_WEAKENED = 2;
const STATE_INFECTED = 1;
const STATE_FLAGGED = 3;

class Virus {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.d = [ 0, -1 ];
        this.infections = 0;
    }
    move(grid) {
        this.x += this.d[0];
        this.y += this.d[1];
        if (grid) {
            grid[this.y] = grid[this.y] || {};
            grid[this.y][this.x] = grid[this.y][this.x] || 0;
        }
        return this;
    }
    turnLeft() {
        this.d = [ this.d[1], 0 - this.d[0] ];
        return this;
    }
    turnRight() {
        this.d = [ 0 - this.d[1], this.d[0] ];
        return this;
    }
    setState(grid, state) {
        grid[this.y] = grid[this.y] || {};
        grid[this.y][this.x] = state;
        return this;
    }
    infect(grid) {
        this.setState(grid, STATE_INFECTED);
        this.infections += 1;
        return this;
    }
    clean(grid) {
        this.setState(grid, STATE_CLEAN);
        return this;
    }
    step(grid) {
        const c = grid[this.y][this.x];
        if (!c) {
            this.turnLeft().infect(grid);
        } else {
            this.turnRight().clean(grid);
        }
        this.move(grid);
    }
}

class Virus2 extends Virus {
    step(grid) {
        const c = grid[this.y][this.x];
        if (c === STATE_CLEAN) {
            this.turnLeft().setState(grid, STATE_WEAKENED);
        } else if (c === STATE_WEAKENED) {
            this.infect(grid);
        } else if (c === STATE_INFECTED) {
            this.turnRight().setState(grid, STATE_FLAGGED);
        } else if (c === STATE_FLAGGED) {
            this.turnLeft().turnLeft().setState(grid, STATE_CLEAN);
        } else {
            throw `Unknown state! ${c}`;
        }
        this.move(grid);
    }
}

function part1(grid, iterations = 70, virus) {
    const v = virus || new Virus();
    for(let i = 0; i < iterations; i++) {
        v.step(grid);
    }
    console.log(v.infections);
}

function part2(grid, iterations = 100) {
    part1(grid, iterations, new Virus2())
}

function getTestInputGrid() { return parse(readFile('22/testInput.txt')); }
part1(getTestInputGrid());

function getInputGrid() { return parse(readFile('22/input.txt')); }
part1(getInputGrid(), 10000);

part2(getTestInputGrid());
// part2(getTestInputGrid(), 10000000);
part2(getInputGrid(), 10000000);