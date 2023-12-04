import {exampleData, starData} from "./03-data";

type V2 = { x: number, y: number };
type CellSpan = {
    position: V2
    length: number
}
type PlacedNumber = CellSpan & {
    value: number
};

type Map = string[][];
type Schema = {
    map: Map,
    numbers: PlacedNumber[],
}

type Engine = {
    numbers: [PlacedNumber, PlacedNumber],
    position: V2,
    score: number
}

const parseData = (data: string) => {
    const result: Schema = {map: [], numbers: []};
    data.split("\n").forEach((row, y) => {
        result.map.push(row.split(""));
        const pattern = /\d+/g
        let match;
        while ((match = pattern.exec(row)) != null) {
            const x = match.index;
            const length = match[0].length;
            const value = parseInt(match[0]);
            result.numbers.push({value, length, position: {x, y}});
        }
    })
    return result;
}
const logSchema = (parsed: Schema) => {
    console.log(parsed.map.map(r => r.join("")).join("\n"));
    console.table(parsed.numbers);
}

const cellsAround = (number: CellSpan): V2[] => {
    const above = Array.from({length: number.length + 2}).map((_, i) => {
        return {x: number.position.x - 1 + i, y: number.position.y - 1}
    })
    const below = Array.from({length: number.length + 2}).map((_, i) => {
        return {x: number.position.x - 1 + i, y: number.position.y + 1}
    })
    const all = [{x: number.position.x - 1, y: number.position.y}, {x: number.position.x + number.length, y: number.position.y}, ...above, ...below];
    return all;
}

const isPartNumber = (number: PlacedNumber, map: Map) => {
    const all = cellsAround(number);
    return all.filter(({x, y}) => x >= 0 && y >= 0 && x < map[0].length && y < map.length).some(({x, y}) => map[y][x] != ".");
}

const cellSpanIntersects = (span: CellSpan, point: V2) => {
    return span.position.y == point.y && span.position.x <= point.x && span.position.x + span.length > point.x;
}

function getEngines(parsed: Schema) {
    let engines: Engine[] = []
    parsed.map.forEach((r, y) => r.forEach((c, x) => {
        if (parsed.map[y][x] == "*") {
            const position = {x, y}
            const cells = cellsAround({position, length: 1});
            const numbersAdjacent = [...new Set(parsed.numbers.filter(n => cells.some(c=>cellSpanIntersects(n, c))))];
            if (numbersAdjacent.length == 2) {
                engines.push({numbers: [numbersAdjacent[0], numbersAdjacent[1]], score: numbersAdjacent[0].value * numbersAdjacent[1].value, position});
            }
        }
    }));
    return engines;
}

const solve = (data: string) => {
    const parsed = parseData(data);
    console.log("Star 1: ", parsed.numbers.filter(n => isPartNumber(n, parsed.map)).reduce((a, b) => a + b.value, 0));
    console.log("Star 2: ",getEngines(parsed).reduce((a,b)=>a+b.score,0));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
