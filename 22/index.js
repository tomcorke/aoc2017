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
            l[vx] = line.substr(x, 1);
        }
        return l;
    }

    for (let y = 0; y < h; y++) {
        const vy = y - cy;
        grid[vy] = parseLine(lines[y]);
    }

    return grid;
}

class Virus {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.d = [ 0, -1 ];
    }
    move() {
        this.x += this.d[0];
        this.y += this.d[1];
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
}

function part1(grid) {
    const v = new Virus();
}

const testInputGrid = parse(readFile('22/testInput.txt'))
part1(testInputGrid);
