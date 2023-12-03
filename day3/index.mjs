export default async function run({ inputLines }) {
  // solution
  const parsed = inputLines.map((line) =>
    line.split("").map((c) => {
      if (c === ".") {
        return null;
      }
      if (!isNaN(+c)) {
        return +c;
      }
      return c;
    })
  );

  const numbers = [];
  const symbols = [];

  for (let i = 0; i < parsed.length; i++) {
    let currentNumber = 0;
    let startIndex = null;
    const handleNumberEnd = (index = parsed[i].length) => {
      if (startIndex !== null) {
        numbers.push({
          number: currentNumber,
          start: startIndex,
          end: [i, index - 1],
        });
        startIndex = null;
        currentNumber = 0;
      }
    };
    for (let j = 0; j < parsed[i].length; j++) {
      if (typeof parsed[i][j] === "number") {
        if (startIndex === null) {
          startIndex = [i, j];
        }
        currentNumber = currentNumber * 10 + parsed[i][j];
        continue;
      }
      handleNumberEnd(j);
      if (parsed[i][j] === null) {
        continue;
      }
      symbols.push({
        symbol: parsed[i][j],
        index: [i, j],
      });
    }
    handleNumberEnd();
  }

  const partNumbers = numbers.filter((n) => {
    const min = [n.start[0] - 1, n.start[1] - 1];
    const max = [n.end[0] + 1, n.end[1] + 1];
    return symbols.some(
      (s) =>
        s.index[0] >= min[0] &&
        s.index[1] >= min[1] &&
        s.index[0] <= max[0] &&
        s.index[1] <= max[1]
    );
  });

  console.log(partNumbers.map((n) => n.number).reduce((rv, curr) => rv + curr));

  const gears = symbols
    .filter((s) => s.symbol === "*")
    .map((g) => {
      const adjacent = numbers.filter((n) => {
        const min = [n.start[0] - 1, n.start[1] - 1];
        const max = [n.end[0] + 1, n.end[1] + 1];
        return (
          g.index[0] >= min[0] &&
          g.index[1] >= min[1] &&
          g.index[0] <= max[0] &&
          g.index[1] <= max[1]
        );
      });
      if (adjacent.length !== 2) {
        return null;
      }
      return adjacent.map((n) => n.number).reduce((rv, curr) => rv * curr);
    })
    .filter((g) => g !== null);

  console.log(gears.reduce((rv, curr) => rv + curr));
}
