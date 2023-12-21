export default async function run({ inputLines }) {
  const gardenMap = inputLines.map((l) => l.split(""));

  const even = gardenMap.map((l) => l.map(() => new Set()));
  const odd = gardenMap.map((l) => l.map(() => new Set()));

  const isValid = (coord) => {
    return gardenMap[coord[0]][coord[1]] !== "#";
  };
  const wrapCoord = (coord) => {
    const newCoord = [...coord];
    const offset = [0, 0];
    if (coord[0] < 0) {
      newCoord[0] = gardenMap.length - 1;
      offset[0] = -1;
    } else if (coord[0] == gardenMap.length) {
      newCoord[0] = 0;
      offset[0] = 1;
    }
    if (coord[1] < 0) {
      newCoord[1] = gardenMap[0].length - 1;
      offset[1] = -1;
    } else if (coord[1] == gardenMap.length) {
      newCoord[1] = 0;
      offset[1] = 1;
    }
    return [newCoord, offset];
  };
  const expandCache = {};
  const expand = (coord) => {
    const key = coord.join(",");
    if (expandCache[key]) {
      return expandCache[key];
    }
    const result = [];
    for (let i = -1; i <= 1; i += 2) {
      const [coord1, offset1] = wrapCoord([coord[0] + i, coord[1]]);
      if (isValid(coord1)) {
        result.push([coord1, offset1]);
      }
      const [coord2, offset2] = wrapCoord([coord[0], coord[1] + i]);
      if (isValid(coord2)) {
        result.push([coord2, offset2]);
      }
    }
    expandCache[key] = result;
    return result;
  };

  const makeAStep = (current, isEven) => {
    const nextMap = isEven ? even : odd;
    const next = [];
    current.forEach(([coord, offset]) => {
      const coords = expand(coord);
      coords.forEach(([nextCoord, nextOffset]) => {
        const combinedOffset = [
          offset[0] + nextOffset[0],
          offset[1] + nextOffset[1],
        ];
        const set = nextMap[nextCoord[0]][nextCoord[1]];
        const offsetKey = combinedOffset.join(",");
        if (set.has(offsetKey)) {
          return;
        }
        set.add(offsetKey);
        next.push([nextCoord, combinedOffset]);
      });
    });
    return next;
  };

  const start = gardenMap
    .flatMap((l, i) => l.map((x, j) => (x === "S" ? [i, j] : null)))
    .filter((x) => x !== null)[0];
  let newCoords = [[start, [0, 0]]];
  even[start[0]][start[1]].add([0, 0].join(","));
  const loops = [];
  const loopCounts = [];
  const offsetCounts = [];
  for (let i = 0; i < 1000; i++) {
    newCoords = makeAStep(newCoords, i % 2 === 1);
    if (newCoords.some((c) => c[0][0] === start[0] && c[0][1] === start[1])) {
      loops.push(i + 1);
      loopCounts.push(
        (i % 2 === 1 ? even : odd)
          .map((l) => l.reduce((a, b) => a + b.size, 0))
          .reduce((a, b) => a + b)
      );
    }
    if (i === loops.at(-1) - 1 + 65) {
      offsetCounts.push(
        (i % 2 === 1 ? even : odd)
          .map((l) => l.reduce((a, b) => a + b.size, 0))
          .reduce((a, b) => a + b)
      );
    }
  }
  console.log(loops);
  console.log(loopCounts);
  // Use these to find a quadratic equation for counts at the loop + offset we need
  console.log(offsetCounts);
}
