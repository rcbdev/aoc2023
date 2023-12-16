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

  const testBeam = (start) => {
    if (!isInMap(start)) {
      return 0;
    }

    let beams = [start];
    const visitedMap = map.map((l) => l.map(() => 0));
    const seenKey = (beam) =>
      `${beam.loc[0]}-${beam.loc[1]}-${beam.dir[0]}-${beam.dir[1]}`;
    const seen = [seenKey(start)];
    const isNew = (beam) => {
      const key = seenKey(beam);
      if (seen.includes(key)) {
        return false;
      }
      seen.push(key);
      return true;
    };

    while (beams.length > 0) {
      const nextBeams = [];
      const addBeam = (beam) => {
        if (isInMap(beam) && isNew(beam)) {
          nextBeams.push(beam);
        }
      };
      for (let i = 0; i < beams.length; i++) {
        const beam = beams[i];
        const char = map[beam.loc[0]][beam.loc[1]];
        visitedMap[beam.loc[0]][beam.loc[1]] = 1;

        if (char === "\\" || char === "/") {
          addBeam(bounceBeam(beam, char));
          continue;
        }
        if (char === "-" || char === "|") {
          splitBeam(beam, char).forEach(addBeam);
          continue;
        }
        addBeam(moveInDir(beam));
      }
      beams = nextBeams;
    }

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
