export default async function run({ inputLines }) {
  const replacements = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const regex = new RegExp(`${replacements.join("|")}|\\d`, "g");
  const getAllMatches = (str) => {
    const matches = [];
    let match;
    while ((match = regex.exec(str))) {
      matches.push(match[0]);
      regex.lastIndex = match.index + 1;
    }
    return matches;
  };
  const wordToNumber = (word) =>
    replacements.includes(word) ? replacements.indexOf(word) + 1 : +word;

  const numbers = inputLines.map((line) => {
    const matches = getAllMatches(line);
    const replaced = matches.map(wordToNumber);
    return 10 * replaced[0] + replaced[replaced.length - 1];
  });

  console.log(numbers.reduce((rv, curr) => rv + curr));
}
