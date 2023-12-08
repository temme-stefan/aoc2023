import {exampleData, starData} from "./07-data";

const toBag = (s: string) => s.split("")
    .reduce((bag, char) => bag.set(char, (bag.get(char) ?? 0) + 1), new Map<string, number>());

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const cards2 = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];

const handTypes = [
    {
        name: "Five of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 1;
        },
    },
    {
        name: "Four of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 2 && [...count.values()].some(c => c == 4);
        },
    },
    {
        name: "Full house",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 2 && [...count.values()].some(c => c == 3);
        },
    },
    {
        name: "Three of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 3 && [...count.values()].some(c => c == 3);
        },
    },
    {
        name: "Two pair",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 3 && [...count.values()].filter(c => c == 2).length == 2;
        },
    },
    {
        name: "One pair",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 4;
        },
    },
    {
        name: "High card",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            return count.size == 5;
        },
    }
];
const handTypes2 = [
    {
        name: "Five of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 1
                || count.size == 2 && joker > 0;
        }
    },
    {
        name: "Four of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 2 && [...count.values()].some(c => c == 4)
                || count.size == 3 && joker > 0 && [...count.entries()].some(([s, c]) => s != "J" && c + joker == 4);
        }
    },
    {
        name: "Full house",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 2 && [...count.values()].some(c => c == 3)
                || count.size == 3 && joker > 0 && [...count.entries()].some(([s, c]) => s != "J" && c + joker == 3);
        }
    },
    {
        name: "Three of a kind",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 3 && [...count.values()].some(c => c == 3)
                || count.size == 4 && joker > 0 && [...count.entries()].some(([s, c]) => s != "J" && c + joker == 3);
        }
    },
    {
        name: "Two pair",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 3 && [...count.values()].filter(c => c == 2).length == 2
                || count.size == 4 && joker == 1
        }
    },
    {
        name: "One pair",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 4
                || count.size == 5 && joker == 1;
        }
    },
    {
        name: "High card",
        isOfType: (hand: string) => {
            const count = toBag(hand);
            const joker = count.get("J") ?? 0;
            return count.size == 5 && joker == 0;
        }
    }
];

type THand = {
    hand: string, bet: number
}
type TIndexedHand = THand & { typeIndex: number }

const getComparer = (cards: string[]) => (a: TIndexedHand, b: TIndexedHand) => {
    const deltaType = Math.sign(b.typeIndex - a.typeIndex);
    if (deltaType != 0) {
        return deltaType;
    }
    for (let i = 0; i < a.hand.length; i++) {
        if (a.hand[i] != b.hand[i]) {
            return Math.sign(cards.indexOf(b.hand[i]) - cards.indexOf(a.hand[i]));
        }
    }
    return 0;
}

const parse = (data: string): THand[] => {
    return data.split("\n").map(row => {
        const [hand, bet] = row.split(" ");
        return {
            hand,
            bet: parseInt(bet),
        }
    })
}

function getRanked(parsed: THand[], hands: typeof handTypes, compare: (a: TIndexedHand, b: TIndexedHand) => number) {
    return parsed
        .map(h => {
            return {...h, typeIndex: hands.indexOf(hands.find(t => t.isOfType(h.hand))),}
        })
        .toSorted(compare)
        .map((hand, i) => {
            return {...hand, rank: i + 1}
        });
}

const solve = (data: string) => {
    const parsed = parse(data);
    const reducer = (a: number, {rank, bet}: { rank: number, bet: number }) => a + rank * bet;
    console.log("Star 1: ", getRanked(parsed, handTypes, getComparer(cards)).reduce(reducer, 0))
    console.log("Star 2: ", getRanked(parsed, handTypes2, getComparer(cards2)).reduce(reducer, 0))
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
