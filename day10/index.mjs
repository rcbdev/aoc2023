export default async function run({ inputLines }) {
  // [top, right, bottom, left]
  const pipeTypes = {
    "|": [1, 0, 1, 0],
    "-": [0, 1, 0, 1],
    L: [1, 1, 0, 0],
    J: [1, 0, 0, 1],
    7: [0, 0, 1, 1],
    F: [0, 1, 1, 0],
    ".": [0, 0, 0, 0],
    S: [1, 1, 1, 1],
  };

  const map = inputLines.map((l) => l.split(""));

  const startIndex = map
    .map((l, i) => [i, l.indexOf("S")])
    .find((i) => i[1] !== -1);

  let currentLocations = [
    {
      index: startIndex,
      from: [0, 0, 0, 0],
    },
  ];
  let moves = 0;
  const keyFromIndex = ([a, b]) => `${a}-${b}`;
  const visited = [keyFromIndex(startIndex)];
  const visitedIndexes = [startIndex];

  while (true) {
    currentLocations = currentLocations.flatMap((location) => {
      const [a, b] = location.index;
      const pipe = pipeTypes[map[a][b]];
      const directions = pipe.map((x, i) => (location.from[i] === 1 ? 0 : x));

      return directions
        .map((x, i) => {
          if (x === 0) {
            return null;
          }

          let next = [];
          switch (i) {
            case 0:
              next = [a - 1, b];
              break;
            case 1:
              next = [a, b + 1];
              break;
            case 2:
              next = [a + 1, b];
              break;
            case 3:
              next = [a, b - 1];
              break;
          }
          const nextPipe = pipeTypes[map[next[0]]?.[next[1]]];
          if ((nextPipe?.[(i + 2) % 4] ?? 0) === 0) {
            return null;
          }
          if (visited.includes(keyFromIndex(next))) {
            return null;
          }
          visited.push(keyFromIndex(next));
          visitedIndexes.push(next);
          const from = [0, 0, 0, 0];
          from[(i + 2) % 4] = 1;
          return {
            index: next,
            from,
          };
        })
        .filter((x) => x !== null);
    });

    moves++;

    if (currentLocations.length === 1) {
      break;
    }
  }

  console.log(moves);

  const expandedMap = new Array(map.length * 2 + 2).fill(0).map((_, i) => {
    if (i % 2 === 0) {
      return new Array(map[0].length * 2 + 2).fill(1);
    }
    return new Array(map[0].length * 2 + 2)
      .fill(0)
      .map((_, j) => (j % 2 === 0 ? 1 : 0));
  });

  for (let i = 0; i < visitedIndexes.length; i++) {
    const index = visitedIndexes[i];
    expandedMap[index[0] * 2 + 1][index[1] * 2 + 1] = "X";
    if (i === visitedIndexes.length - 1) {
      continue;
    }
    const toPairWith =
      i === 0 ? [1, 2] : i === visitedIndexes.length - 2 ? [1] : [2];

    toPairWith.forEach((x) => {
      const paired = visitedIndexes[i + x];
      const a = index[0] + paired[0] + 1;
      const b = index[1] + paired[1] + 1;
      expandedMap[a][b] = "X";
    });
  }

  const queue = [[0, 0]];

  while (queue.length > 0) {
    const index = queue.pop();
    if (
      index[0] < 0 ||
      index[1] < 0 ||
      index[0] === expandedMap.length ||
      index[1] === expandedMap[0].length
    ) {
      continue;
    }
    if (expandedMap[index[0]][index[1]] === "X") {
      continue;
    }

    expandedMap[index[0]][index[1]] = "X";

    queue.push([index[0] - 1, index[1]]);
    queue.push([index[0] + 1, index[1]]);
    queue.push([index[0], index[1] - 1]);
    queue.push([index[0], index[1] + 1]);
  }

  console.log(expandedMap.flatMap((x) => x).filter((x) => x === 0).length);
}
