export default async function run({ inputLines }) {
  const gardenMap = inputLines.map((l) => l.split(""));

  const isValid = (coord) => {
    if (
      coord[0] < 0 ||
      coord[1] < 0 ||
      coord[0] >= gardenMap.length ||
      coord[1] >= gardenMap[0].length
    ) {
      return false;
    }
    return gardenMap[coord[0]][coord[1]] !== "#";
  };

  const makeAStep = (current) => {
    const next = [];
    const seen = new Set();
    current.forEach((coord) => {
      for (let i = -1; i <= 1; i += 2) {
        const coord1 = [coord[0] + i, coord[1]];
        if (isValid(coord1)) {
          const key = coord1.join(",");
          if (!seen.has(key)) {
            next.push(coord1);
            seen.add(key);
          }
        }
        const coord2 = [coord[0], coord[1] + i];
        if (isValid(coord2)) {
          const key = coord2.join(",");
          if (!seen.has(key)) {
            next.push(coord2);
            seen.add(key);
          }
        }
      }
    });
    return next;
  };

  let coords = [
    gardenMap
      .flatMap((l, i) => l.map((x, j) => (x === "S" ? [i, j] : null)))
      .filter((x) => x !== null)[0],
  ];
  for (let i = 0; i < 64; i++) {
    coords = makeAStep(coords);
  }
  console.log(coords.length);
}
