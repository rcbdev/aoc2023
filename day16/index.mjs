export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));

  const moveInDir = ({ loc, dir }, next) => {
    next({
      loc: [loc[0] + dir[0], loc[1] + dir[1]],
      dir,
    });
  };
  const bounceUpLeft = ({ loc, dir }, next) => {
    moveInDir({ loc, dir: [dir[1], dir[0]] }, next);
  };
  const bounceUpRight = ({ loc, dir }, next) => {
    moveInDir({ loc, dir: [-1 * dir[1], -1 * dir[0]] }, next);
  };
  const splitVertical = ({ loc, dir }, next) => {
    if (dir[0] === 0) {
      moveInDir({ loc, dir: [1, 0] }, next);
      moveInDir({ loc, dir: [-1, 0] }, next);
      return;
    }
    moveInDir({ loc, dir }, next);
  };
  const splitHorizontal = ({ loc, dir }, next) => {
    if (dir[1] === 0) {
      moveInDir({ loc, dir: [0, 1] }, next);
      moveInDir({ loc, dir: [0, -1] }, next);
      return;
    }
    moveInDir({ loc, dir }, next);
  };

  const moves = {
    ".": moveInDir,
    "/": bounceUpRight,
    "\\": bounceUpLeft,
    "-": splitHorizontal,
    "|": splitVertical,
  };
  const moveMap = map.map((l) => l.map((x) => moves[x]));

  const isInMap = ({ loc }) =>
    loc[0] >= 0 && loc[0] < map.length && loc[1] >= 0 && loc[1] < map[0].length;
  const dirIndex = ({ dir }) => {
    if (dir[0] === -1) {
      return 0;
    }
    if (dir[0] === 1) {
      return 1;
    }
    if (dir[1] === -1) {
      return 2;
    }
    return 3;
  };

  const testBeam = (start) => {
    const visited = map.map((l) => l.map(() => [0, 0, 0, 0]));
    const next = (beam) => {
      const idx = dirIndex(beam);
      if (isInMap(beam) && !visited[beam.loc[0]][beam.loc[1]][idx]) {
        visited[beam.loc[0]][beam.loc[1]][idx] = 1;
        moveMap[beam.loc[0]][beam.loc[1]](beam, next);
      }
    };
    next(start);

    return visited
      .map((l) => l.reduce((a, b) => +b.includes(1) + a, 0))
      .reduce((a, b) => a + b);
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
