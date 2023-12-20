export default async function run({ inputLines }) {
  const parseInput = () => {
    const modules = Object.fromEntries(
      inputLines.map((l) => {
        const split = l.split(" -> ");
        const type = l[0];
        const name = type === "b" ? split[0] : split[0].replace(type, "");
        const outputs = split[1].split(", ");
        return [
          name,
          {
            name,
            type,
            outputs,
            state: 0,
            inputs: {},
          },
        ];
      })
    );
    Object.values(modules).forEach((m) => {
      m.outputs.forEach((o) => {
        if (modules[o]) {
          modules[o].inputs[m.name] = 0;
        }
      });
    });
    return modules;
  };

  const broadcaster = (input, module) => {
    return module.outputs.map((o) => [input, o, module.name]);
  };
  const flipFlop = (input, module) => {
    if (input) {
      return [];
    }
    module.state = (module.state + 1) % 2;
    return module.outputs.map((o) => [module.state, o, module.name]);
  };
  const conjunction = (input, module, from) => {
    module.inputs[from] = input;
    const pulse = Object.values(module.inputs).every((x) => x === 1) ? 0 : 1;
    return module.outputs.map((o) => [pulse, o, module.name]);
  };

  const moduleHandlers = {
    b: broadcaster,
    "%": flipFlop,
    "&": conjunction,
  };

  const modules = parseInput();

  const runCycle = (modules) => {
    let highPulses = 0;
    let lowPulses = 0;
    const pulses = [[0, "broadcaster", "button"]];
    while (pulses.length) {
      const next = pulses.shift();
      if (next[0] === 0) {
        lowPulses++;
      } else {
        highPulses++;
      }
      if (!modules[next[1]]) {
        continue;
      }
      const module = modules[next[1]];
      const result = moduleHandlers[module.type](next[0], module, next[2]);
      pulses.push(...result);
    }

    return [lowPulses, highPulses];
  };

  const cycles = [];
  for (let i = 0; i < 1000; i++) {
    cycles.push(runCycle(modules));
  }
  const totalLow = cycles.reduce((rv, curr) => rv + curr[0], 0);
  const totalHigh = cycles.reduce((rv, curr) => rv + curr[1], 0);

  console.log(totalLow * totalHigh);

  const newModules = parseInput();
  const broadcastOutputs = newModules["broadcaster"].outputs;
  const parts = broadcastOutputs.map((o) => {
    const path = [];
    let module = modules[o];

    while (true) {
      const entry = { name: module.name, include: false };
      let next = null;
      for (let i = 0; i < module.outputs.length; i++) {
        if (modules[module.outputs[i]].type === "&") {
          entry.include = true;
        } else {
          next = modules[module.outputs[i]];
        }
      }
      path.push(entry);
      if (next === null) {
        break;
      }
      module = next;
    }
    return path;
  });

  const partNumbers = parts.map(
    (p) =>
      +`0b${[...p]
        .reverse()
        .map((x) => (x.include ? 1 : 0))
        .join("")}`
  );

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  console.log(partNumbers.reduce(lcm));
}
