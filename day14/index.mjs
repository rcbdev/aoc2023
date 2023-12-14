export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));
  const transpose = (map) => {
    const rotated = [];
    for (let i = 0; i < map[0].length; i++) {
      rotated.push(map.map((l) => l[i]));
    }
    return rotated;
  };

  const columns = transpose(map);

  const rollRocks = (rotatedMap, direction = 1) =>
    rotatedMap.map((c) => {
      const result = [...c];

      if (direction === 1) {
        let moveTo = 0;
        for (let i = 0; i < c.length; i++) {
          if (c[i] === "#") {
            moveTo = i + 1;
            continue;
          }
          if (c[i] === "O") {
            result[i] = ".";
            result[moveTo] = "O";
            moveTo++;
            continue;
          }
        }
      } else {
        let moveTo = c.length - 1;
        for (let i = c.length - 1; i >= 0; i--) {
          if (c[i] === "#") {
            moveTo = i - 1;
            continue;
          }
          if (c[i] === "O") {
            result[i] = ".";
            result[moveTo] = "O";
            moveTo--;
            continue;
          }
        }
      }
      return result;
    });

  const rolledNorth = rollRocks(columns);

  const calculateLoads = (columns) =>
    columns.map((c) => {
      let total = 0;
      for (let i = 0; i < c.length; i++) {
        if (c[i] === "O") {
          total += c.length - i;
        }
      }
      return total;
    });

  const loads = calculateLoads(rolledNorth);

  console.log(loads.reduce((rv, curr) => rv + curr));

  const runACycle = (map) => {
    let currentMap = map;
    for (let i = 0; i < 4; i++) {
      const rolled = rollRocks(currentMap, i < 2 ? 1 : -1);
      currentMap = transpose(rolled);
    }
    return currentMap;
  };

  const runCycles = (map, count) => {
    const seen = [];
    const maps = [];
    let repeatStart = -1;
    const testMap = (map) => {
      const transposed = transpose(map);
      const drawnMap = transposed.map((l) => l.join("")).join("\n");
      if (seen.includes(drawnMap) && repeatStart === -1) {
        repeatStart = seen.length;
      }
      if (seen.filter((x) => x === drawnMap).length === 2) {
        return true;
      }
      seen.push(drawnMap);
      maps.push(map);
      return false;
    };
    let currentMap = map;
    testMap(map);
    for (let i = 0; i < count; i++) {
      currentMap = runACycle(currentMap);
      if (testMap(currentMap)) {
        break;
      }
    }
    const resultIndex =
      ((count - repeatStart) % (maps.length - repeatStart)) + repeatStart;
    return maps[resultIndex];
  };

  const afterCycles = runCycles(columns, 1000000000);
  const loads2 = calculateLoads(afterCycles);

  console.log(loads2.reduce((rv, curr) => rv + curr));
}
