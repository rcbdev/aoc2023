export default async function run({ inputLines }) {
  const workflows = {};
  const parts = [];

  let inputPart = 1;
  inputLines.forEach((line) => {
    if (line === "") {
      inputPart = 2;
      return;
    }
    if (inputPart === 1) {
      const split = line.split("{");
      const name = split[0];
      const workflow = split[1]
        .replace("}", "")
        .split(",")
        .map((c) => {
          if (c.includes(":")) {
            const [condition, next] = c.split(":");
            if (condition.includes(">")) {
              const [prop, valString] = condition.split(">");
              const val = +valString;
              return {
                test: (part) => part[prop] > val,
                isDefault: false,
                prop,
                op: ">",
                val,
                next,
              };
            }
            const [prop, valString] = condition.split("<");
            const val = +valString;
            return {
              test: (part) => part[prop] < val,
              isDefault: false,
              prop,
              op: "<",
              val,
              next,
            };
          }
          return {
            test: () => true,
            isDefault: true,
            next: c,
          };
        });
      workflows[name] = workflow;
      return;
    }
    const part = {};
    const props = line.replace("{", "").replace("}", "").split(",");
    props.forEach((x) => {
      const [prop, valString] = x.split("=");
      part[prop] = +valString;
    });
    parts.push(part);
  });

  const testPart = (part) => {
    let current = "in";
    while (true) {
      if (current === "A") {
        return true;
      }
      if (current === "R") {
        return false;
      }
      const workflow = workflows[current];
      current = workflow.find(({ test }) => test(part)).next;
    }
  };

  const accceptedParts = parts.filter(testPart);
  console.log(
    accceptedParts
      .map((p) => Object.values(p).reduce((a, b) => a + b))
      .reduce((a, b) => a + b)
  );

  const testPath = (ranges, workflowName) => {
    if (workflowName === "R") {
      return 0;
    }
    if (workflowName === "A") {
      return Object.values(ranges)
        .map(([a, b]) => Math.max(0, b - a + 1))
        .reduce((a, b) => a * b);
    }

    const workflow = workflows[workflowName];
    let subRanges = { ...ranges };

    return workflow
      .map((condidition) => {
        if (condidition.isDefault) {
          return testPath(subRanges, condidition.next);
        }
        if (condidition.op === ">") {
          const thisRanges = {
            ...subRanges,
            [condidition.prop]: [
              condidition.val + 1,
              subRanges[condidition.prop][1],
            ],
          };
          subRanges = {
            ...subRanges,
            [condidition.prop]: [
              subRanges[condidition.prop][0],
              condidition.val,
            ],
          };
          return testPath(thisRanges, condidition.next);
        }
        const thisRanges = {
          ...subRanges,
          [condidition.prop]: [
            subRanges[condidition.prop][0],
            condidition.val - 1,
          ],
        };
        subRanges = {
          ...subRanges,
          [condidition.prop]: [condidition.val, subRanges[condidition.prop][1]],
        };
        return testPath(thisRanges, condidition.next);
      })
      .reduce((a, b) => a + b);
  };

  console.log(
    testPath(
      {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
      },
      "in"
    )
  );
}
