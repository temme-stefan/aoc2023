import {exampleData, starData} from "./18-data";


function createMap(commands: {dir: string; steps: number }[]) {
    const map = [["#"]];
    const addRow = (after: boolean) => {
        const newRow = Array.from(map[0]).map(_ => ".");
        if (after) {
            map.push(newRow);
        } else {
            map.unshift(newRow);
        }
    }
    const addColumn = (after: boolean) => {
        if (after) {
            map.forEach(row => row.push("."));
        } else {
            map.forEach(row => row.unshift("."));
        }
    }
    let posX = 0, posY = 0;
    for (const {dir, steps} of commands) {
        switch (dir) {
            case "R":
                while (map[0].length <= posX + steps) {
                    addColumn(true)
                }
                for (let i = 0; i < steps; i++) {
                    posX++;
                    map[posY][posX] = "#";
                }
                break;
            case "L":
                while (0 > posX - steps) {
                    addColumn(false);
                    posX++
                }
                for (let i = 0; i < steps; i++) {
                    posX--;
                    map[posY][posX] = "#";
                }
                break;
            case "D":
                while (map.length <= posY + steps) {
                    addRow(true)
                }
                for (let i = 0; i < steps; i++) {
                    posY++;
                    map[posY][posX] = "#";
                }
                break;
            case "U":
                while (0 > posY - steps) {
                    addRow(false);
                    posY++
                }
                for (let i = 0; i < steps; i++) {
                    posY--;
                    map[posY][posX] = "#";
                }
                break;
        }
    }
    addRow(true);
    addRow(false);
    addColumn(true);
    addColumn(false)
    return map;
}

const parse = (data: string) => {
    const commands = data.split("\n",).map(row => {
        const [, dir, steps, hexStep ,dirInd ] = /^(R|D|L|U) (\d+) \(#(.{5})(.)\)$/.exec(row)
        const dir2 ="RDLU"[parseInt(dirInd)];
        return {dir, steps: parseInt(steps), dir2, steps2: parseInt(hexStep,16)};
    });
    const map = createMap(commands);
    // Don't do that!
    // const map2 = createMap(commands.map(({steps2,dir2})=>{return {steps:steps2,dir:dir2}}))
    return {map, commands};
}

const countFlooded = (map: string[][]) => {
    const flooded = Array.from(map).map(row => Array.from(row).map(_ => false));
    const queue: [number, number][] = [[0, 0]];
    flooded[0][0] = true;
    const getAdjacent = ([x, y]: [number, number]): [number, number][] => ([[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][])
        .map(([oX, oY]) => [x + oX, y + oY] as [number, number])
        .filter(([x, y]) => x >= 0 && y >= 0 && y < map[0].length && x < map.length)
    while (queue.length > 0) {
        const current = queue.shift();
        const adjacent = getAdjacent(current);

        adjacent.filter(([x, y]) => !flooded[x][y] && map[x][y] == ".").forEach(([x, y]) => {
            flooded[x][y] = true;
            queue.push([x, y]);
        })
    }
    return  map.length*map[0].length - flooded.flat().filter(Boolean).length;
}
const solve = (data: string) => {
    const {map, commands} = parse(data);
    console.log("Star 1: ", countFlooded(map));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
