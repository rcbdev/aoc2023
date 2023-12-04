export default async function run({ inputLines }) {
  const cards = inputLines.map((line) => {
    const data = line.split(":")[1];
    const parts = data
      .split("|")
      .map((part) => part.trim().split(" ").filter(Boolean));

    return {
      winners: parts[0],
      numbers: parts[1],
    };
  });

  const winningCounts = cards.map(
    (card) => card.winners.filter((w) => card.numbers.includes(w)).length
  );

  const scores = winningCounts.map((count) =>
    count === 0 ? 0 : Math.pow(2, count - 1)
  );

  console.log(scores.reduce((rv, curr) => rv + curr));

  const multiples = cards.map(() => 1);

  winningCounts.forEach((count, i) => {
    if (count > 0) {
      for (let j = i + 1; j < Math.min(i + 1 + count, multiples.length); j++) {
        multiples[j] += multiples[i];
      }
    }
  });

  console.log(multiples.reduce((rv, curr) => rv + curr));
}
