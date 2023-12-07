export default async function run({ inputLines }) {
  const getType = (counts) => {
    const rawCounts = Object.values(counts);
    if (rawCounts.includes(5)) {
      return 7;
    }
    if (rawCounts.includes(4)) {
      return 6;
    }
    if (rawCounts.includes(3)) {
      if (rawCounts.includes(2)) {
        return 5;
      }
      return 4;
    }
    if (rawCounts.filter((x) => x === 2).length === 2) {
      return 3;
    }
    if (rawCounts.includes(2)) {
      return 2;
    }
    return 1;
  };
  const sortHands = (hands, cardOrder) =>
    [...hands].sort((a, b) => {
      if (a.type === b.type) {
        for (let i = 0; i < 5; i++) {
          if (a.cards[i] !== b.cards[i]) {
            return (
              cardOrder.indexOf(b.cards[i]) - cardOrder.indexOf(a.cards[i])
            );
          }
        }
        return 0;
      }

      return a.type - b.type;
    });
  const getWinnings = (orderedHands) =>
    orderedHands.reduce((rv, curr, i) => rv + curr.bid * (i + 1), 0);

  const hands = inputLines.map((l) => {
    const [cards, bid] = l.split(" ");
    const cardCounts = cards
      .split("")
      .reduce((rv, curr) => ({ ...rv, [curr]: (rv[curr] ?? 0) + 1 }), {});

    return {
      cards,
      cardCounts,
      type: getType(cardCounts),
      bid,
    };
  });
  const orderedHands = sortHands(hands, "AKQJT98765432");
  console.log(getWinnings(orderedHands));

  const handsWithJoker = hands.map((h) => {
    if (!h.cardCounts["J"]) {
      return h;
    }
    const maxNonJoker = Object.entries(h.cardCounts)
      .filter(([c]) => c !== "J")
      .reduce((rv, curr) => (rv[1] > curr[1] ? rv : curr), ["A", 0]);

    const cardCounts = {
      ...h.cardCounts,
      J: 0,
      [maxNonJoker[0]]: maxNonJoker[1] + h.cardCounts["J"],
    };

    return {
      ...h,
      cardCounts,
      type: getType(cardCounts),
    };
  });
  const orderedJokerHands = sortHands(handsWithJoker, "AKQT98765432J");
  console.log(getWinnings(orderedJokerHands));
}
