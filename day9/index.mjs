export default async function run({ inputLines }) {
  const sequences = inputLines.map((l) => l.split(" ").map((x) => +x));

  const diffs = sequences.map((s) => {
    const layers = [s];
    let last = s;

    while (last.some((x) => x !== 0)) {
      last = last
        .map((x, i, arr) => (i === 0 ? null : x - arr[i - 1]))
        .filter((x) => x !== null);
      layers.push(last);
    }

    return layers;
  });

  const part1 = diffs.map((diff) =>
    diff.reduceRight((rv, curr) => curr[curr.length - 1] + rv, 0)
  );
  console.log(part1.reduce((rv, curr) => rv + curr));

  const part2 = diffs.map((diff) =>
    diff.reduceRight((rv, curr) => curr[0] - rv, 0)
  );
  console.log(part2.reduce((rv, curr) => rv + curr));
}
