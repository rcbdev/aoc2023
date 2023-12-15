export default async function run({ inputLines }) {
  const steps = inputLines[0].split(",");

  const hash = (string) =>
    string
      .split("")
      .reduce((rv, curr) => ((rv + curr.charCodeAt(0)) * 17) % 256, 0);

  const stepHashes = steps.map(hash);

  console.log(stepHashes.reduce((rv, curr) => rv + curr));

  const boxes = new Array(256).fill(null).map(() => []);

  for (let i = 0; i < steps.length; i++) {
    const label = steps[i].match(/\w+/)[0];
    const instruction = steps[i].match(/-|=/)[0];
    const boxIdx = hash(label);
    const box = boxes[boxIdx];
    const idx = box.findIndex((x) => x[0] === label);

    if (instruction === "=") {
      const power = +steps[i].split(instruction)[1];
      if (idx === -1) {
        box.push([label, power]);
      } else {
        box[idx][1] = power;
      }
    } else if (idx !== -1) {
      boxes[boxIdx] = [...box.slice(0, idx), ...box.slice(idx + 1)];
    }
  }

  const boxPower = (box, boxNumber) =>
    box.reduce(
      (rv, curr, idx) => (boxNumber + 1) * (idx + 1) * curr[1] + rv,
      0
    );

  console.log(boxes.reduce((rv, curr, idx) => rv + boxPower(curr, idx), 0));
}
