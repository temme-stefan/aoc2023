import {exampleData, starData} from "./06-data";

const toNumbers = (spacedNumbers: string) => spacedNumbers.split(" ").filter(s => s.length > 0).map(s => parseInt(s));
const parse = (data: string) => {
    const [time, distance] = data.split("\n").map(r => toNumbers(r.split(":")[1]));
    return {time, distance}
}

function solveParableGreaterZero(p: number, q: number) {
    const summand = Math.sqrt(p * p / 4 - q);
    const zeroPoints = [p / 2 + summand, p / 2 - summand].sort((a, b) => Math.sign(a - b));
    const adjustSmallerThan = (n: number, i: number) => {
        if (-n * n + n * p - q == 0) {
            n += i == 0 ? 1 : -1;
        }
        return n;
    }
    return [Math.ceil(zeroPoints[0]), Math.floor(zeroPoints[1])].map(adjustSmallerThan);
}

const solve = (data: string) => {
    const parsed = parse(data);
    console.log("Star 1: ", parsed.time.map((t, i) => {
        const d = parsed.distance[i];
        return solveParableGreaterZero(t, d);
    }).reduce((a, [x, y]) => a * (y - x + 1), 1));
    const t = parseInt(parsed.time.reduce((a, b) => a + b, ""));
    const d = parseInt(parsed.distance.reduce((a, b) => a + b, ""));
    const intervall = solveParableGreaterZero(t, d);
    console.log("Star 2: ", intervall[1] - intervall[0] + 1);
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
