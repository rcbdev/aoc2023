export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));
  const expansionHorizontalLines = map
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.every((x) => x === "."))
    .map(({ i }) => i);
  const expansionVerticalLines = [];
  for (let i = 0; i < map[0].length; i++) {
    if (map.every((l) => l[i] === ".")) {
      expansionVerticalLines.push(i);
    }
  }

  const galaxies = map
    .flatMap((l, i) =>
      l.map((x, j) => ({
        char: x,
        coord: [i, j],
      }))
    )
    .filter((x) => x.char === "#");

  const getTotalDistance = (amount) =>
    galaxies
      .flatMap((g, i) =>
        galaxies.slice(i + 1).map((g2) => {
          const minY = Math.min(g.coord[0], g2.coord[0]);
          const maxY = Math.max(g.coord[0], g2.coord[0]);
          const minX = Math.min(g.coord[1], g2.coord[1]);
          const maxX = Math.max(g.coord[1], g2.coord[1]);
          const horizontalExpansions = expansionHorizontalLines.filter(
            (y) => y > minY && y < maxY
          );
          const verticalExpansions = expansionVerticalLines.filter(
            (x) => x > minX && x < maxX
          );
          return (
            maxY -
            minY +
            maxX -
            minX +
            horizontalExpansions.length * (amount - 1) +
            verticalExpansions.length * (amount - 1)
          );
        })
      )
      .reduce((rv, curr) => rv + curr);

  console.log(getTotalDistance(2));
  console.log(getTotalDistance(1000000));
}
