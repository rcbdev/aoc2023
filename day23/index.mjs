export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));
  const nodeMap = {};
  const start = [0, 1];
  const end = [map.length - 1, map[0].length - 2];

  const getKey = (arr) => arr.join("-");
  const startNode = getKey(start);
  const endNode = getKey(end);

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

  const makeNodeMap = (point = start) => {
    const node = [];

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
      node.push({ length, point: getKey(lastPoint) });
    }
    nodeMap[getKey(point)] = node.sort((a, b) =>
      a.point === endNode ? -1 : b.point === endNode ? 1 : 0
    );

    const newNodes = node
      .map((path) => path.point)
      .filter((key) => !nodeMap[key]);

    newNodes.forEach((newNode) =>
      makeNodeMap(newNode.split("-").map((x) => +x))
    );
  };
  makeNodeMap();

  const nodeKeys = Object.keys(nodeMap);
  const nodeBitmaps = Object.fromEntries(
    nodeKeys.map((k, i) => [k, BigInt(Math.pow(2, i))])
  );
  const hasVisited = (node, visited) => {
    return (nodeBitmaps[node] & visited) !== 0n;
  };
  const markVisited = (node, visited) => {
    return visited | nodeBitmaps[node];
  };

  const layers = {};
  const makeLayers = (nodes = [endNode], currentLayers = [[endNode]]) => {
    if (nodes.length === 0) {
      return;
    }
    nodes.forEach((node) => {
      layers[node] = currentLayers[0].reduce(
        (rv, curr) => markVisited(curr, rv),
        0n
      );
    });
    currentLayers = [nodes, ...currentLayers];
    const seen = currentLayers.flatMap((l) => l);
    const nextLayer = Array.from(
      new Set(
        nodes
          .flatMap((n) => nodeMap[n].map((x) => x.point))
          .filter((n) => !seen.includes(n))
      )
    );
    makeLayers(nextLayer, currentLayers);
  };
  makeLayers();

  const paths = [];
  paths.push({
    length: 0,
    visited: nodeBitmaps[startNode],
    point: startNode,
  });

  let length = 0;

  while (paths.length > 0) {
    const next = paths.pop();
    const options = nodeMap[next.point];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const point = option.point;
      if (hasVisited(point, next.visited)) {
        continue;
      }
      if ((layers[point] & next.visited) === layers[point]) {
        continue;
      }
      if (point === endNode) {
        length = Math.max(length, next.length + option.length);
        break;
      }
      paths.push({
        length: next.length + option.length,
        visited: markVisited(point, next.visited),
        point,
      });
    }
  }

  console.log(length);
}
