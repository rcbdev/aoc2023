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
      source,
      dest,
      func: (input) => input + (dest - source),
      range,
    });
  }
  saveMap();

  let currentType = "seed";
  let currentValues = [...seeds];

  let map;
  while ((map = maps.find((m) => m.from === currentType))) {
    currentValues = currentValues.map((v) => {
      const conversion = map.conversions.find(
        (c) => c.source <= v && c.source + c.range > v
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
      length: seeds[i + 1],
    });
  }

  currentType = "seed";
  let currentRanges = [...seedRanges];

  const fillGaps = (ranges, min, max) => {
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    let current = min;
    const all = sorted.flatMap((range) => {
      if (range.start === current) {
        current = range.start + range.length;
        return [range];
      }
      const gap = {
        start: current,
        length: range.start - current,
        conversion: (x) => x,
      };
      current = range.start + range.length;
      return [gap, range];
    });
    if (current <= max) {
      all.push({
        start: current,
        length: max - current + 1,
        conversion: (x) => x,
      });
    }
    return all;
  };

  while ((map = maps.find((m) => m.from === currentType))) {
    currentRanges = currentRanges.flatMap((r) => {
      const min = r.start;
      const max = r.start + r.length - 1;
      const conversions = map.conversions.filter(
        (c) => c.source + c.range > min && c.source <= max
      );
      const ranges = conversions.map((c) => {
        const start = Math.max(c.source, min);
        const end = Math.min(c.source + c.range - 1, max);
        return {
          start,
          length: end - start + 1,
          conversion: c.func,
        };
      });

      const allRanges = fillGaps(ranges, min, max);

      return allRanges.map((r) => ({
        start: r.conversion(r.start),
        length: r.length,
      }));
    });
    currentType = map.to;
  }

  console.log(Math.min(...currentRanges.map((r) => r.start)));
}
