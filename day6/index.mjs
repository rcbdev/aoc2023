export default async function run({ inputLines }) {
  const [times, distances] = inputLines.map((l) =>
    l
      .split(":")[1]
      .trim()
      .split(/\s+/)
      .map((x) => +x)
  );

  const games = times.map((t, i) => ({
    time: t,
    distance: distances[i],
  }));

  const getWinningCounts = ({ time: t, distance: d }) => {
    const minMax = [
      (-1 * t + Math.sqrt(Math.pow(t, 2) - 4 * d)) / -2,
      (-1 * t - Math.sqrt(Math.pow(t, 2) - 4 * d)) / -2,
    ];
    return Math.abs(Math.ceil(minMax[0]) - Math.ceil(minMax[1]));
  };

  const winningOptionsCounts = games.map(getWinningCounts);
  console.log(winningOptionsCounts.reduce((rv, curr) => rv * curr, 1));

  const [singleTime, singleDistance] = inputLines.map(
    (l) => +l.replaceAll(" ", "").split(":")[1]
  );
  console.log(getWinningCounts({ time: singleTime, distance: singleDistance }));
}
