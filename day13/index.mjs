export default async function run({ inputLines }) {
  const maps = [];
  for (let i = 0; i < inputLines.length; i++) {
    const map = [];
    while (inputLines[i] !== "") {
      map.push(inputLines[i].split(""));
      i++;
    }
    maps.push(map);
  }

  const scores = maps.map((map) => {
    for (let i = 1; i < map.length; i++) {
      let match = true;
      for (let j = 0; j < i && i + j < map.length; j++) {
        const line1 = map[i + j];
        const line2 = map[i - 1 - j];
        if (line1.some((x, idx) => x !== line2[idx])) {
          match = false;
        }
      }
      if (match) {
        return i * 100;
      }
    }
    for (let i = 1; i < map[0].length; i++) {
      let match = true;
      for (let j = 0; j < i && i + j < map[0].length; j++) {
        for (let k = 0; k < map.length && match; k++) {
          if (map[k][i + j] !== map[k][i - 1 - j]) {
            match = false;
          }
        }
      }
      if (match) {
        return i;
      }
    }
  });

  console.log(scores.reduce((rv, curr) => rv + curr));

  const smudgeScores = maps.map((map) => {
    for (let i = 1; i < map.length; i++) {
      let countDiffs = 0;
      for (let j = 0; j < i && i + j < map.length; j++) {
        const line1 = map[i + j];
        const line2 = map[i - 1 - j];
        const diffs = line1.filter((x, idx) => x !== line2[idx]);
        countDiffs += diffs.length;
      }
      if (countDiffs === 1) {
        return i * 100;
      }
    }
    for (let i = 1; i < map[0].length; i++) {
      let countDiffs = 0;
      for (let j = 0; j < i && i + j < map[0].length; j++) {
        for (let k = 0; k < map.length; k++) {
          if (map[k][i + j] !== map[k][i - 1 - j]) {
            countDiffs += 1;
          }
        }
      }
      if (countDiffs === 1) {
        return i;
      }
    }
  });

  console.log(smudgeScores.reduce((rv, curr) => rv + curr));
}
