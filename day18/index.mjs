export default async function run({ inputLines }) {
  const instructions = inputLines.map((l) => {
    const split = l.split(" ");
    const direction = split[0];
    const distance = +split[1];
    const color = split[2].replaceAll(/\(|\)/g, "");
    return {
      direction,
      distance,
      color,
    };
  });

  const directions = {
    U: [-1, 0],
    D: [1, 0],
    R: [0, 1],
    L: [0, -1],
  };
  const calculateArea = (instructions) => {
    let position = [0, 0];
    let areaInside = 0;
    let perimeter = 1;

    const addArea = (a, b) => {
      areaInside += a[1] * b[0] * 0.5;
      areaInside -= b[1] * a[0] * 0.5;
    };

    for (const { direction, distance } of instructions) {
      const prev = position;
      position = [
        position[0] + directions[direction][0] * distance,
        position[1] + directions[direction][1] * distance,
      ];

      addArea(prev, position);
      perimeter += distance;
    }
    addArea(position, [0, 0]);

    return Math.abs(areaInside) + perimeter;
  };

  console.log(calculateArea(instructions));

  const hexDirections = ["R", "D", "L", "U"];
  const hexInstructions = instructions.map(({ color }) => {
    const distance = +`0x${color.substr(1, 5)}`;
    const direction = hexDirections[+color.substr(6)];
    return {
      distance,
      direction,
    };
  });

  console.log(calculateArea(hexInstructions));
}
