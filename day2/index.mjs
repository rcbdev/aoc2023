export default async function run({ inputLines }) {
  const games = inputLines.map((line, i) => {
    const rounds = line.split(":")[1].split(";");
    const parsedRounds = rounds.map((round) =>
      Object.fromEntries(
        round.split(",").map((chunk) => {
          const parts = chunk.trim().split(" ");
          return [parts[1], +parts[0]];
        })
      )
    );
    return {
      number: i + 1,
      rounds: parsedRounds,
      totals: parsedRounds.reduce((rv, curr) => ({
        red: Math.max(rv.red ?? 0, curr.red ?? 0),
        green: Math.max(rv.green ?? 0, curr.green ?? 0),
        blue: Math.max(rv.blue ?? 0, curr.blue ?? 0),
      })),
    };
  });

  const maximums = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const possible = games.filter((game) =>
    Object.entries(maximums).every(
      ([colour, count]) => game.totals[colour] <= count
    )
  );
  console.log(possible.reduce((rv, curr) => rv + curr.number, 0));

  const powers = games.map((game) =>
    Object.values(game.totals).reduce((rv, curr) => rv * curr)
  );
  console.log(powers.reduce((rv, curr) => rv + curr));
}
