import {exampleData, starData} from "./09-data";

const toNumbers = (spacedNumbers: string) => spacedNumbers.split(" ").filter(s => s.length > 0).map(s => parseInt(s));

const parse = (data: string) => data.split("\n").map(toNumbers);

const nextNumber = (sequence: number[]) => {
    const stack = [sequence];
    while (!stack.at(-1).every(n => n == 0)) {
        const lastRow = stack.at(-1); //peek
        const nextRow = []
        for (let i = 0; i < lastRow.length - 1; i++) {
            nextRow.push(lastRow[i + 1] - lastRow[i]);
        }
        stack.push(nextRow)
    }
    let next = 0, previous = 0;
    while (stack.length > 0) {
        const row = stack.pop();
        next += row.at(-1);
        previous = row[0]-previous;
    }
    return [previous, next];
}
const solve = (data: string) => {
    const parsed = parse(data);
    const next = parsed.map(nextNumber);
    console.log("Star 1: ", next.reduce((a, [,b]) => a + b, 0));
    console.log("Star 2: ", next.reduce((a, [b]) => a + b, 0));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
