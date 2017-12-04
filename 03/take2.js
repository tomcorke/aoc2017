function getCoords(inputSize, gridSize) {

  if (inputSize == 1) {
    return { x: 0, y: 0 }
  }

  const maxWidth = Math.ceil(Math.sqrt(inputSize));
  const maxHeight = Math.floor(Math.sqrt(inputSize) + 0.5);

  const maxSize = Math.max(maxWidth, maxHeight);

  const layer = Math.floor(maxSize / 2);
  const layerSize = 1 + (2 * layer);

  const bottomRight = Math.pow(layerSize, 2);
  const bottomLeft = bottomRight - layerSize + 1;
  const topLeft = bottomLeft - layerSize + 1;
  const topRight = topLeft - layerSize + 1;

  const maxDistToMidWidth = Math.floor(layerSize / 2);
  const maxDistToMidHeight = Math.floor(layerSize / 2);

  const midLeft = topLeft + maxDistToMidHeight;
  const midRight = topRight - maxDistToMidHeight;
  const midTop = topRight + maxDistToMidWidth;
  const midBottom = bottomLeft + maxDistToMidWidth;

  let x = 0;
  let y = 0;
  if (inputSize <= topRight) {
    x = midTop - topRight;
    y = midRight - inputSize;
  } else if (inputSize <= topLeft) {
    x = midTop - inputSize;
    y = topLeft - midLeft;
  } else if (inputSize <= bottomLeft) {
    x = midTop - topLeft;
    y = inputSize - midLeft;
  } else {
    x = inputSize - midBottom;
    y = topRight - midRight;
  }

  const dist = Math.abs(x) + Math.abs(y);

  return { x, y, dist }

}

const INDEX = (grid, x, y, i) => i;

function run(inputSizes, fillFunction = INDEX) {

  function fillGrid(inputSize) {

    function createGrid(size) {
      const grid = [];
      for(let x = 0; x < size; x++) {
        grid[x] = [];
        for(let y = 0; y < size; y++) {
          grid[x][y] = 0;
        }
      }
      return grid;
    }

    const maxWidth = Math.ceil(Math.sqrt(inputSize));
    const maxHeight = Math.floor(Math.sqrt(inputSize) + 0.5);

    const maxSize = Math.max(maxWidth, maxHeight);
    const maxPath = maxSize - 1;

    const layer = Math.floor(maxSize / 2);
    const layerSize = 1 + (2 * layer);

    const grid = createGrid(layerSize);

    const midX = Math.floor(grid.length / 2);
    const midY = midX;

    for(let i = 1; i <= inputSize; i++) {
      const dims = getCoords(i, layerSize);
      const x = midX + dims.x;
      const y = midY + dims.y;
      const f = fillFunction(grid, x, y, i);
      grid[x][y] = f;
    }

    return grid;
  }

  return inputSizes.map(inputSize => {
    const grid = fillGrid(inputSize);
    return grid;
  });

}

// run([1, 12, 23, 1024, 368078]);

function sumGrid(grid, x, y, i) {
  if (i == 1) { return 1; }
  let sum = 0;
  for (let vx = x-1; vx <= x+1; vx++) {
    for (let vy = y-1; vy <= y+1; vy++) {
      if (vx >= 0 && vy >= 0 && vx < grid.length && vy < grid.length && grid[vx][vy]) {
        sum += grid[vx][vy];
      }
    }
  }
  return sum;
}

run([65], sumGrid).map(grid => console.log(grid))