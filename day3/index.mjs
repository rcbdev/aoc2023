export default async function run({ inputLines }) {
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

  const isAdjacent = (start, end) => {
    const min = [start[0] - 1, start[1] - 1];
    const max = [end[0] + 1, end[1] + 1];
    return (point) =>
      point[0] >= min[0] &&
      point[1] >= min[1] &&
      point[0] <= max[0] &&
      point[1] <= max[1];
  };

  const partNumbers = numbers.filter((n) =>
    symbols.map((s) => s.index).some(isAdjacent(n.start, n.end))
  );

  console.log(partNumbers.map((n) => n.number).reduce((rv, curr) => rv + curr));

  const gears = symbols
    .filter((s) => s.symbol === "*")
    .map((g) => {
      const adjacent = numbers.filter((n) =>
        isAdjacent(n.start, n.end)(g.index)
      );
      return adjacent.length === 2
        ? adjacent.map((n) => n.number).reduce((rv, curr) => rv * curr)
        : 0;
    });

  console.log(gears.reduce((rv, curr) => rv + curr));
}
