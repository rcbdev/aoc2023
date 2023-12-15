export default async function run({ inputLines }) {
  const steps = inputLines[0].split(",");

  const hash = (string) =>
    string
      .split("")
      .reduce((rv, curr) => ((rv + curr.charCodeAt(0)) * 17) % 256, 0);

  const stepHashes = steps.map(hash);

  console.log(stepHashes.reduce((rv, curr) => rv + curr));

  const boxes = new Array(256).fill(null).map(() => new Map());

  for (let i = 0; i < steps.length; i++) {
    const label = steps[i].match(/\w+/)[0];
    const instruction = steps[i].match(/-|=/)[0];
    const box = boxes[hash(label)];

    if (instruction === "=") {
      const power = +steps[i].split(instruction)[1];
      box.set(label, power);
    } else {
      box.delete(label);
    }
  }

  const boxPower = (box, boxNumber) =>
    Array.from(box.values()).reduce(
      (rv, curr, idx) => (boxNumber + 1) * (idx + 1) * curr + rv,
      0
    );

  console.log(boxes.reduce((rv, curr, idx) => rv + boxPower(curr, idx), 0));
}
