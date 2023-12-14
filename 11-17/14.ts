import {exampleData, starData} from "./14-data";

const stone = "O";
const ground = ".";
const parse = (data: string) => {
    return data.split("\n").map(row => row.split(""));
}
type map = ReturnType<typeof parse>;

const clone = (map: map) => Array.from(map).map(r => Array.from(r));

const rollNorth = (map: map) => {
    const copy = clone(map);
    for (let i = 1; i < copy.length; i++) {
        for (let j = 0; j < copy[i].length; j++) {
            if (copy[i][j] == stone) {
                let lookAt = i;
                while (lookAt > 0 && copy[lookAt - 1][j] == ground) {
                    lookAt--;
                }
                if (lookAt != i) {
                    copy[i][j] = ground;
                    copy[lookAt][j] = stone;
                }
            }
        }
    }
    return copy;
}
const rollSouth = (map: map) => {
    return rollNorth(map.toReversed()).toReversed()
}

const rollEast = (map: map) => {
    const copy = clone(map);
    for (let i = 0; i < copy.length; i++) {
        for (let j = copy[i].length - 2; j >= 0; j--) {
            if (copy[i][j] == stone) {
                let lookAt = j;
                while (lookAt < copy[i].length && copy[i][lookAt + 1] == ground) {
                    lookAt++;
                }
                if (lookAt != j) {
                    copy[i][j] = ground;
                    copy[i][lookAt] = stone;
                }
            }
        }
    }
    return copy;
}

const rollWest = (map: map) => {
    const copy = clone(map);
    for (let i = 0; i < copy.length; i++) {
        for (let j = 1; j < copy[i].length; j++) {
            if (copy[i][j] == stone) {
                let lookAt = j;
                while (lookAt > 0 && copy[i][lookAt - 1] == ground) {
                    lookAt--;
                }
                if (lookAt != j) {
                    copy[i][j] = ground;
                    copy[i][lookAt] = stone;
                }
            }
        }
    }
    return copy;
}

const rollCircle = (map: map) => rollEast(rollSouth(rollWest(rollNorth(map))));

const loadNorth = (map: map): number => {
    return map
        .map((row, i) => (map.length - i) * row.filter(c => c == stone).length)
        .reduce((a, b) => a + b, 0);
}

const unParse = (map: map) => map.map(r => r.join("")).join("\n");


const cache = new Map<string, number>()
const circlemany = (map: map, many = 1000000000) => {
    let current = 0;
    let key = unParse(map);
    let copy = clone(map);
    while (!cache.has(key) && current < many) {
        cache.set(key, current);
        current++;
        copy = rollCircle(copy);
        key = unParse(copy);
    }
    if (current < many) {
        const offset = cache.get(key);
        const delta = current - offset;
        const stepsToGo = (many - offset) % delta;
        const foundKey = [...cache.entries()].find(([, round]) => round == offset + stepsToGo)?.[0] ?? "";
        copy = parse(foundKey);
    }
    return copy;
}

const solve = (data: string) => {
    const parsed = parse(data);
    const rolled = rollNorth(parsed);
    const poleLoad = loadNorth(rolled);
    console.log("Star 1: ", poleLoad);
    const circled = circlemany(parsed);
    console.log("Star 2: ", loadNorth(circled));

}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
