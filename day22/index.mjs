export default async function run({ inputLines }) {
  const bricks = inputLines.map((l) =>
    l.split("~").map((a) => a.split(",").map((b) => +b))
  );

  const movedBricks = JSON.parse(JSON.stringify(bricks)).sort(
    (a, b) => a[0][2] - b[0][2]
  );

  const maxX = Math.max(...bricks.flatMap((b) => b.map((c) => c[0])));
  const maxY = Math.max(...bricks.flatMap((b) => b.map((c) => c[1])));

  const zMap = Array.from({ length: maxX + 1 }, () =>
    new Array(maxY + 1).fill([1, -1])
  );
  const holding = new Map();
  const held = new Map();
  holding.set(-1, new Set());

  movedBricks.forEach((brick, i) => {
    holding.set(i, new Set());
    held.set(i, new Set());

    const zs = [];
    for (let x = brick[0][0]; x <= brick[1][0]; x++) {
      for (let y = brick[0][1]; y <= brick[1][1]; y++) {
        zs.push(zMap[x][y][0]);
      }
    }
    const z = Math.max(...zs);
    const zOffset = brick[0][2] - z;
    brick[0][2] -= zOffset;
    brick[1][2] -= zOffset;
    for (let x = brick[0][0]; x <= brick[1][0]; x++) {
      for (let y = brick[0][1]; y <= brick[1][1]; y++) {
        if (zMap[x][y][0] === z) {
          holding.get(zMap[x][y][1]).add(i);
          held.get(i).add(zMap[x][y][1]);
        }
        zMap[x][y] = [brick[1][2] + 1, i];
      }
    }
  });

  let count = 0;
  holding.forEach((v) => {
    let match = true;
    v.forEach((x) => {
      if (held.get(x).size === 1) {
        match = false;
        return false;
      }
    });
    if (match) {
      count++;
    }
  });

  console.log(count);

  const willFall = new Array(bricks.length).fill(0);
  for (let i = bricks.length - 1; i >= 0; i--) {
    const brickHolds = holding.get(i);
    if (brickHolds.size === 0) {
      continue;
    }
    let count = 0;
    const toCheck = [...brickHolds];
    const removed = [i];
    while (toCheck.length > 0) {
      const next = toCheck.shift();
      if (removed.includes(next)) {
        continue;
      }
      if ([...held.get(next)].every((x) => removed.includes(x))) {
        count++;
        removed.push(next);
        toCheck.push(...holding.get(next));
      }
    }
    willFall[i] = count;
  }

  console.log(willFall.reduce((a, b) => a + b));
}
