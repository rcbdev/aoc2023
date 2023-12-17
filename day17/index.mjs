import PriorityQueue from "./queue.mjs";

export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split("").map((x) => +x));

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const directionIndex = (direction) => {
    if (direction[0] === 0) {
      if (direction[1] === 1) {
        return 0;
      }
      return 1;
    }
    if (direction[0] === 1) {
      return 2;
    }
    return 3;
  };
  const isInMap = (coord) =>
    coord[0] >= 0 &&
    coord[0] < map.length &&
    coord[1] >= 0 &&
    coord[1] < map[0].length;
  const getNeighbours = (
    { coord, currentDirection, currentDistance, heat },
    maxInDir,
    minInDir,
    visited
  ) => {
    let newDirections = directions.filter(
      (x) =>
        !(
          x[0] * -1 === currentDirection[0] && x[1] * -1 === currentDirection[1]
        )
    );
    return newDirections
      .map((d) => {
        const multiple =
          d[0] === currentDirection[0] && d[1] === currentDirection[1]
            ? 1
            : minInDir;
        const newCoord = [
          coord[0] + d[0] * multiple,
          coord[1] + d[1] * multiple,
        ];
        if (!isInMap(newCoord)) {
          return null;
        }
        const distance =
          d[0] === currentDirection[0] && d[1] === currentDirection[1]
            ? currentDistance + 1
            : multiple;
        if (distance > maxInDir) {
          return null;
        }
        if (visited[newCoord[0]][newCoord[1]][directionIndex(d)][distance]) {
          return null;
        }
        visited[newCoord[0]][newCoord[1]][directionIndex(d)][distance] = 1;
        let newHeat = heat + map[newCoord[0]][newCoord[1]];
        for (let i = 1; i < multiple; i++) {
          newHeat += map[coord[0] + d[0] * i][coord[1] + d[1] * i];
        }

        return {
          coord: newCoord,
          currentDirection: d,
          currentDistance: distance,
          heat: newHeat,
        };
      })
      .filter((x) => x !== null);
  };

  const target = [map.length - 1, map[0].length - 1];
  const isTarget = (coord) => coord[0] === target[0] && coord[1] === target[1];

  const findBestPath = (maxInDir = 3, minInDir = 1) => {
    const visited = map.map((l) =>
      l.map(() => [
        new Array(maxInDir).fill(0),
        new Array(maxInDir).fill(0),
        new Array(maxInDir).fill(0),
        new Array(maxInDir).fill(0),
      ])
    );

    const queue = new PriorityQueue((a, b) => a.heat < b.heat);
    queue.push({
      coord: [0, 0],
      currentDirection: [0, 0],
      currentDistance: 0,
      heat: 0,
    });

    while (!queue.isEmpty()) {
      const next = queue.pop();
      if (isTarget(next.coord)) {
        return next.heat;
      }
      const neighbours = getNeighbours(next, maxInDir, minInDir, visited);
      neighbours.forEach((x) => queue.push(x));
    }
  };

  console.log(findBestPath());
  console.log(findBestPath(10, 4));
}
