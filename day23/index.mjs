export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));
  const nodeMap = {};
  const start = [0, 1];
  const end = [map.length - 1, map[0].length - 2];

  const isValid = (tile) => {
    if (
      tile[0] < 0 ||
      tile[1] < 0 ||
      tile[0] >= map.length ||
      tile[1] >= map[0].length
    ) {
      return false;
    }
    const val = map[tile[0]][tile[1]];
    return val !== "#";
  };
  const upDownLeftRight = (tile) => [
    [tile[0] - 1, tile[1]],
    [tile[0] + 1, tile[1]],
    [tile[0], tile[1] - 1],
    [tile[0], tile[1] + 1],
  ];
  const getKey = (arr) => arr.join("-");

  const makeNodeMap = (point = start) => {
    const node = {
      paths: [],
      longest: 0,
    };

    const getNext = (point, lastPoint) =>
      upDownLeftRight(point)
        .filter(isValid)
        .filter((tile) => tile[0] !== lastPoint[0] || tile[1] !== lastPoint[1]);
    const next = getNext(point, [-1, -1]);

    for (let i = 0; i < next.length; i++) {
      let lastPoint = point;
      let pathPoint = getNext(next[i], lastPoint);
      lastPoint = next[i];
      let length = 1;
      while (pathPoint.length === 1) {
        const thisPoint = pathPoint[0];
        pathPoint = getNext(thisPoint, lastPoint);
        lastPoint = thisPoint;
        length++;
      }
      node.paths.push([length, getKey(lastPoint)]);
    }
    nodeMap[getKey(point)] = node;

    const newNodes = node.paths
      .map((path) => path[1])
      .filter((key) => !nodeMap[key]);

    newNodes.forEach((newNode) =>
      makeNodeMap(newNode.split("-").map((x) => +x))
    );
  };

  makeNodeMap();

  const paths = [];
  paths.push({
    length: 0,
    path: [getKey(start)],
    point: getKey(start),
  });
  const endNode = getKey(end);

  let length = 0;

  while (paths.length > 0) {
    const next = paths.pop();
    if (next.point === endNode) {
      length = Math.max(length, next.length);
    }
    const options = nodeMap[next.point].paths;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const length = next.length + option[0];
      const point = option[1];
      if (next.path.includes(point)) {
        continue;
      }
      paths.push({
        length,
        path: [...next.path, point],
        point,
      });
    }
  }

  console.log(length);
}
