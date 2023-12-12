export default async function run({ inputLines }) {
  const lines = inputLines.map((l) => ({
    groups: l
      .split(" ")[1]
      .split(",")
      .map((x) => +x),
    row: l.split(" ")[0],
  }));

  const countOptions = (lines) =>
    lines.map(({ groups, row: rawRow }) => {
      const row = "." + rawRow + ".";
      const countsUpTo = new Array(groups.length + 1)
        .fill(0)
        .map(() => new Array(row.length).fill(0));

      let firstHash = row.indexOf("#");
      if (firstHash === -1) {
        firstHash = row.length;
      }

      const getCountsUpTo = (group, character) => {
        if (group === -1) {
          return character > -1 && character < firstHash ? 1 : 0;
        }
        return countsUpTo[group][character] ?? 0;
      };
      const recordCountsUpTo = (group, character, count) => {
        countsUpTo[group][character] = count;
      };

      for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < row.length; j++) {
          let count = 0;
          if (row[j] !== "#") {
            count += getCountsUpTo(i, j - 1);
          }
          let match = row[j] !== "#";
          for (let k = 0; match && k < groups[i]; k++) {
            if (row[j - k - 1] === ".") {
              match = false;
            }
          }
          if (match) {
            count += getCountsUpTo(i - 1, j - groups[i] - 1);
          }
          recordCountsUpTo(i, j, count);
        }
      }

      return getCountsUpTo(groups.length - 1, row.length - 1);
    });

  console.log(countOptions(lines).reduce((rv, curr) => rv + curr));

  const bigLines = lines.map((l) => ({
    groups: new Array(5).fill(0).flatMap(() => [...l.groups]),
    row: new Array(5).fill(l.row).join("?"),
  }));

  console.log(countOptions(bigLines).reduce((rv, curr) => rv + curr));
}
