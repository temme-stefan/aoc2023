import {exampleData, starData} from "./04-data";

type Card = { winningNumbers: number[], score: number, cardname: string, havingNumbers: number[], amountMatching: number, instances: number }

const toNumbers = (spacedNumbers: string) => spacedNumbers.split(" ").filter(s => s.length > 0).map(s => parseInt(s));
const parseCard = (row: string): Card => {
    const [cardname, numbers] = row.split(":");
    const [winningNumbers, havingNumbers] = numbers.split("|").map(toNumbers);
    const amountMatching = winningNumbers.filter(n => havingNumbers.includes(n)).length
    const score = Math.floor(Math.pow(2, amountMatching - 1));
    return {
        cardname, winningNumbers, havingNumbers, score, amountMatching, instances: 1
    }

}

const playGame = (cards: Card[]) => {
    cards.forEach((card, walk, cards) => {
        const numberOfInstances = card.instances;
        for (let i = walk + 1; i < cards.length && i < walk + 1 + card.amountMatching; i++) {
            cards[i].instances += numberOfInstances;
        }
    });
}

const solve = (data: string) => {
    const cards = data.split("\n").map(parseCard);
    console.log("Star 1: ", cards.reduce((a, b) => a + b.score, 0))
    playGame(cards);
    console.log("Star 2: ", cards.reduce((a, b) => a + b.instances, 0));
}

console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
