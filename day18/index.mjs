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
    const vertices = [];
    let position = [0, 0];

    for (let i = 0; i < instructions.length; i++) {
      const { direction, distance } = instructions[i];
      position = [
        position[0] + directions[direction][0] * distance,
        position[1] + directions[direction][1] * distance,
      ];
      vertices.push(position);
    }

    let areaInside = 0;
    for (let i = 0; i < vertices.length; i++) {
      var addX = vertices[i][1];
      var addY = vertices[(i + 1) % vertices.length][0];
      var subX = vertices[(i + 1) % vertices.length][1];
      var subY = vertices[i][0];

      areaInside += addX * addY * 0.5;
      areaInside -= subX * subY * 0.5;
    }

    const perimeter =
      instructions.reduce((rv, curr) => rv + curr.distance / 2, 0) + 1;

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
