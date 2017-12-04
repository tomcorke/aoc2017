const inputSizes = [1, 12, 23, 1024, 368078];

function minAbs(a, b) {
  return Math.abs(a) <= Math.abs(b) ? a : b;
}

function maxAbs(a, b) {
  return Math.abs(a) >= Math.abs(b) ? a : b;
}

function clampAbs(a, cap) {
  if (Math.abs(a) > cap) {
    if (a < 0) {
      return -cap;
    }
    return cap;
  }
  return a;
}

function getDimensions(inputSize) {

  const maxWidth = Math.ceil(Math.sqrt(inputSize));
  const maxHeight = Math.floor(Math.sqrt(inputSize) + 0.5);

  const maxSize = Math.max(maxWidth, maxHeight);
  const maxPath = maxSize - 1;

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

  const totalDist = Math.abs(x) + Math.abs(y);

  return {
    inputSize,
    maxWidth,
    maxHeight,
    maxSize,
    maxPath,
    layer,
    layerSize,
    bottomRight,
    bottomLeft,
    topLeft,
    topRight,
    midLeft,
    midRight,
    midTop,
    midBottom,
    x,
    y,
    totalDist
  }

}

inputSizes.forEach(inputSize => {
  const dims = getDimensions(inputSize);
  console.log(inputSize, dims);
});
