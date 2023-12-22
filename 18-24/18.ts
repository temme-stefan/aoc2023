import {exampleData, starData} from "./18-data";

type Command = { dir: string, steps: number };
type Interval = [number, number];
type MappedIntervall = { x: Interval, y: Interval };

function createMap(commands: Command[]) {
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
        const [, dir, steps, hexStep, dirInd] = /^(R|D|L|U) (\d+) \(#(.{5})(.)\)$/.exec(row)
        const dir2 = "RDLU"[parseInt(dirInd)];
        return [{dir, steps: parseInt(steps)}, {dir: dir2, steps: parseInt(hexStep, 16)}];
    });
    const [c1, c2] = commands.reduce(([a1, a2], [c1, c2]) => {
        a1.push(c1);
        a2.push(c2);
        return [a1, a2];
    }, [[] as Command[], [] as Command[]])
    return {commands1: c1, commands2: c2};
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
    return map.length * map[0].length - flooded.flat().filter(Boolean).length;
}

const createIntervalMap = (commands: Command[]) => {
    const intervalls: MappedIntervall[] = [];
    let posX = 0, posY = 0, minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (const {dir, steps} of commands) {
        switch (dir) {
            case "R":
                intervalls.push({x: [posX, posX + steps], y: [posY, posY]})
                posX += steps;
                break;
            case "L":
                intervalls.push({x: [posX - steps, posX], y: [posY, posY]})
                posX -= steps;
                break;
            case "D":
                intervalls.push({x: [posX, posX], y: [posY, posY + steps]})
                posY += steps;
                break;
            case "U":
                intervalls.push({x: [posX, posX], y: [posY - steps, posY]})
                posY -= steps;
                break;
        }
        const added = intervalls.at(-1);
        minX = Math.min(minX, added.x[0])
        maxX = Math.max(maxX, added.x[1])
        minY = Math.min(minY, added.y[0])
        maxY = Math.max(maxY, added.y[1])
    }
    return {intervalls, minX, maxX, minY, maxY};
}
const solve = (data: string) => {
    const parsed = parse(data);
    const map = createMap(parsed.commands1);
    console.log("Star 1: ", countFlooded(map));
    const {intervalls, minX, maxX, minY, maxY} = createIntervalMap(parsed.commands1);
    for (let i = minX; i <= maxX; i++) {
        const intervallsToLookAt = intervalls.filter(int => int.x[0] <= i && i <= int.x[1]).sort((a, b) => {
            const first = Math.sign(a.y[0] - b.y[0])
            const second = Math.sign(a.y[1] - b.y[1])
            return first == 0 ? second : first;
        });
        let flooded = intervallsToLookAt[0].y[0] - minY;
        let lastHorizontal: MappedIntervall
        let inside = false, gotVeritcalBeetween = false;
        for (const mappedIntervall of intervallsToLookAt) {
            const horizontal = mappedIntervall.y[0] == mappedIntervall.y[1];
            if (horizontal) {
                if (gotVeritcalBeetween) {
                    if (lastHorizontal.x[0] == mappedIntervall.x[0] || lastHorizontal.x[1] == mappedIntervall.x[1]) {
                        //uLikestruktur -> do nothing
                    } else {
                        //crossing the border
                        inside = !inside;
                    }
                } else {
                    if (lastHorizontal) {
                        if (!inside) {
                            flooded +=  mappedIntervall.y[0] - lastHorizontal.y[1] -1;
                        }
                        inside = !inside;
                    }
                }
                lastHorizontal = mappedIntervall;
                gotVeritcalBeetween = false;
            } else {
                gotVeritcalBeetween = true;
            }

        }

        console.log(i, intervallsToLookAt, flooded)
    }

    // Don't do that!
    // const map2 = createMap(parsed.commands2)
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
// console.time("Stardata");
// console.log("Stardata")
// solve(starData);
// console.timeEnd("Stardata");
