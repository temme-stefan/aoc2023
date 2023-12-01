import {exampleData, exampleData2, starData} from "./01-data";

const numberwords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const numberdigits= Array.from({length: 10}).map((_, i) => `${i}`);
const search = numberwords.concat(numberdigits);
const toDigit = (s: string) => numberwords.includes(s) ? numberwords.indexOf(s) + 1 : parseInt(s);
const stringReverse = (s: string) => s.split("").reverse().join("");

function solveWithDigits(data: string) {
    return data.split("\n").map(r => {
        const firstDigit = r.match(/\d/)?.[0] ?? "0";
        const lastDigit = r.match(/(\d)[^\d]*$/)?.[1] ?? "0";
        return parseInt(firstDigit + lastDigit);
    }).reduce((a, c) => a + c, 0);
}

function solveWithDigitsAndWords(data: string) {
    return data.split("\n").map(r => {
        const firstMatch = r.match(new RegExp(`(\\d|${numberwords.join("|")})`))?.[0] ?? "0";
        const lastMatch = stringReverse(stringReverse(r).match(new RegExp(`(\\d|${stringReverse(numberwords.join("|"))})`))?.[1] ?? "0");
        return toDigit(firstMatch) * 10 + toDigit(lastMatch);
    }).reduce((a, c) => a + c, 0);
}

function solveWithDigitsAndWords2(data: string) {
    return data.split("\n").map(r => {
        let first: string, last: string, firstIndex = r.length, lastIndex = -1;
        search.forEach(s => {
            const foundStart = r.indexOf(s);
            if (foundStart > -1 && foundStart < firstIndex) {
                first = s;
                firstIndex = foundStart;
            }
            const foundEnd = r.lastIndexOf(s);
            if (foundEnd > lastIndex) {
                last = s;
                lastIndex = foundEnd;
            }
        });
        return toDigit(first!) * 10 + toDigit(last!);

    }).reduce((a, c) => a + c, 0);
}


const solve = (data: string) => {
    console.time()
    console.log("Star 1: solveWithDigits", solveWithDigits(data));
    console.timeEnd()
    console.time()
    console.log("Star 2: solveWithNumberwords", solveWithDigitsAndWords(data));
    console.timeEnd()
    console.time()
    console.log("Star 2: solveWithNumberwords", solveWithDigitsAndWords2(data));
    console.timeEnd()
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
