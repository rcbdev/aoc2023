export default async function run({ inputLines }) {
  const directionToIndex = { L: 0, R: 1 };
  const pattern = inputLines[0].split("");

  const paths = Object.fromEntries(
    inputLines.slice(2).map((l) => {
      const parts = l.split(" = ");
      const from = parts[0];
      const to = parts[1].replace("(", "").replace(")", "").split(", ");
      return [from, to];
    })
  );

  const traversePathToCondition = (start, endCondition) => {
    let moves = 0;
    let currentLocation = start;

    do {
      const direction = pattern[moves % pattern.length];
      currentLocation = paths[currentLocation][directionToIndex[direction]];
      moves++;
    } while (!endCondition(currentLocation));

    return [moves, currentLocation];
  };

  console.log(traversePathToCondition("AAA", (l) => l === "ZZZ")[0]);

  const startLocations = Object.keys(paths).filter((k) => k.endsWith("A"));

  const pathLengthsToZ = startLocations.map(
    (l) => traversePathToCondition(l, (l2) => l2.endsWith("Z"))[0]
  );

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  console.log(pathLengthsToZ.reduce(lcm));
}
