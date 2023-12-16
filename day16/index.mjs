export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));

  const moveInDir = ({ loc, dir }) => {
    const newLoc = [loc[0] + dir[0], loc[1] + dir[1]];
    return {
      loc: newLoc,
      dir,
    };
  };
  const bounceBeam = ({ loc, dir }, mirror) => {
    const newDir =
      mirror === "\\" ? [dir[1], dir[0]] : [-1 * dir[1], -1 * dir[0]];
    return moveInDir({ loc, dir: newDir });
  };
  const splitBeam = ({ loc, dir }, splitter) => {
    let newDirs = [];
    if (splitter === "|") {
      if (dir[0] === 0) {
        newDirs = [
          [1, 0],
          [-1, 0],
        ];
      } else {
        newDirs = [dir];
      }
    } else {
      if (dir[1] === 0) {
        newDirs = [
          [0, 1],
          [0, -1],
        ];
      } else {
        newDirs = [dir];
      }
    }
    return newDirs.map((d) => moveInDir({ loc, dir: d }));
  };
  const isInMap = ({ loc }) =>
    loc[0] >= 0 && loc[0] < map.length && loc[1] >= 0 && loc[1] < map[0].length;
  const seenKey = (beam) =>
    `${beam.loc[0]}-${beam.loc[1]}-${beam.dir[0]}-${beam.dir[1]}`;

  const handleBeam = (beam, visitedMap, seen) => {
    if (!isInMap(beam)) {
      return;
    }
    const key = seenKey(beam);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    const char = map[beam.loc[0]][beam.loc[1]];
    visitedMap[beam.loc[0]][beam.loc[1]] = 1;

    if (char === "\\" || char === "/") {
      handleBeam(bounceBeam(beam, char), visitedMap, seen);
      return;
    }
    if (char === "-" || char === "|") {
      const beams = splitBeam(beam, char);
      handleBeam(beams[0], visitedMap, seen);
      if (beams[1]) {
        handleBeam(beams[1], visitedMap, seen);
      }
      return;
    }
    handleBeam(moveInDir(beam), visitedMap, seen);
  };

  const testBeam = (start) => {
    if (!isInMap(start)) {
      return 0;
    }

    const visitedMap = map.map((l) => l.map(() => 0));
    const seen = new Set();

    handleBeam(start, visitedMap, seen);

    return visitedMap.flatMap((x) => x).reduce((rv, curr) => rv + curr);
  };

  console.log(testBeam({ loc: [0, 0], dir: [0, 1] }));

  let best = 0;
  const max = Math.max(map.length, map[0].length);
  for (let i = 0; i < max; i++) {
    const score1 = testBeam({ loc: [i, 0], dir: [0, 1] });
    const score2 = testBeam({ loc: [i, map[0].length - 1], dir: [0, -1] });
    const score3 = testBeam({ loc: [0, i], dir: [1, 0] });
    const score4 = testBeam({ loc: [map.length - 1, i], dir: [-1, 0] });

    best = Math.max(best, score1, score2, score3, score4);
  }

  console.log(best);
}
