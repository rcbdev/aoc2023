import PriorityQueue from "./queue.mjs";

export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split("").map((x) => +x));

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const directionIndex = (direction) =>
    directions.findIndex((x) => x[0] == direction[0] && x[1] === direction[1]);
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
    let newDirections =
      currentDistance > 0 && currentDistance < minInDir
        ? [currentDirection]
        : directions;
    return newDirections
      .filter(
        (x) =>
          !(
            x[0] * -1 === currentDirection[0] &&
            x[1] * -1 === currentDirection[1]
          )
      )
      .map((d) => {
        const newCoord = [coord[0] + d[0], coord[1] + d[1]];
        if (!isInMap(newCoord)) {
          return null;
        }
        const distance =
          d[0] === currentDirection[0] && d[1] === currentDirection[1]
            ? currentDistance + 1
            : 1;
        if (distance > maxInDir) {
          return null;
        }
        if (visited[newCoord[0]][newCoord[1]][directionIndex(d)][distance]) {
          return null;
        }
        visited[newCoord[0]][newCoord[1]][directionIndex(d)][distance] = 1;

        return {
          coord: newCoord,
          currentDirection: d,
          currentDistance: distance,
          heat: heat + map[newCoord[0]][newCoord[1]],
        };
      })
      .filter((x) => x !== null);
  };

  const target = [map.length - 1, map[0].length - 1];
  const isTarget = (coord) => coord[0] === target[0] && coord[1] === target[1];

  const findBestPath = (maxInDir = 3, minInDir = 0) => {
    const visited = map.map((l) =>
      l.map(() => [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
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
