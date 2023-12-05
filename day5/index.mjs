export default async function run({ inputLines }) {
  // solution
  const seeds = inputLines[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((s) => +s);

  const maps = [];
  let currentMap = null;
  const saveMap = () => {
    if (currentMap !== null) {
      maps.push(currentMap);
      currentMap = null;
    }
  };
  for (let i = 2; i < inputLines.length; i++) {
    if (inputLines[i] === "") {
      saveMap();
      continue;
    }
    if (currentMap === null) {
      const [from, to] = inputLines[i].split(" ")[0].split("-to-");
      currentMap = {
        from,
        to,
        conversions: [],
      };
      continue;
    }
    const [dest, source, range] = inputLines[i].split(" ").map((x) => +x);
    currentMap.conversions.push({
      start: source,
      end: source + range - 1,
      func: (input) => input + (dest - source),
    });
  }
  saveMap();

  let currentType = "seed";
  let currentValues = [...seeds];

  let map;
  while ((map = maps.find((m) => m.from === currentType))) {
    currentValues = currentValues.map((v) => {
      const conversion = map.conversions.find(
        (c) => c.start <= v && c.end >= v
      );
      return conversion ? conversion.func(v) : v;
    });
    currentType = map.to;
  }

  console.log(Math.min(...currentValues));

  const seedRanges = [];

  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({
      start: seeds[i],
      end: seeds[i] + seeds[i + 1] - 1,
    });
  }

  currentType = "seed";
  let currentRanges = [...seedRanges];
  const noConversion = (x) => x;

  const fillGaps = (ranges, min, max) => {
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    let current = min;
    const all = sorted.flatMap((range) => {
      const gap =
        range.start !== current
          ? {
              start: current,
              end: range.start - 1,
              conversion: noConversion,
            }
          : null;
      current = range.end + 1;
      return [gap, range].filter(Boolean);
    });
    if (current <= max) {
      all.push({
        start: current,
        end: max,
        conversion: noConversion,
      });
    }
    return all;
  };

  while ((map = maps.find((m) => m.from === currentType))) {
    currentRanges = currentRanges.flatMap((r) => {
      const min = r.start;
      const max = r.end;
      const conversions = map.conversions.filter(
        (c) => c.end >= min && c.start <= max
      );
      const ranges = conversions.map((c) => {
        const start = Math.max(c.start, min);
        const end = Math.min(c.end, max);
        return {
          start,
          end,
          conversion: c.func,
        };
      });

      return fillGaps(ranges, min, max).map((r) => ({
        start: r.conversion(r.start),
        end: r.conversion(r.end),
      }));
    });
    currentType = map.to;
  }

  console.log(Math.min(...currentRanges.map((r) => r.start)));
}
