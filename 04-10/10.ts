import {exampleData, exampleData2, exampleData3, exampleData4, exampleData5, starData} from "./10-data";


type TCoord = { row: number, column: number }
type TNode = TCoord & { value: string, adjacent: Set<TNode>, tube: boolean, flooded: boolean }

const parse = (data: string): [TNode, TNode[][]] => {
    const cells = data.split("\n").map((rowdata, row) =>
        rowdata.split("").map((value, column) => {
            return {
                row, column, value, adjacent: new Set<TNode>(), tube: false, flooded: false
            }
        })
    );
    let s: TNode = null
    const add = (c: TNode, row: number, column: number) => {
        if (row >= 0 && column >= 0 && row < cells.length && column < cells[row].length) {
            const other = cells[row][column];
            c.adjacent.add(other);
        }
    }
    const north = (c: TNode) => add(c, c.row - 1, c.column);
    const south = (c: TNode) => add(c, c.row + 1, c.column);
    const west = (c: TNode) => add(c, c.row, c.column - 1);
    const east = (c: TNode) => add(c, c.row, c.column + 1);
    cells.flat().forEach(c => {
        switch (c.value) {
            case "|": // is a vertical pipe connecting north and south
                north(c);
                south(c);
                break;
            case "-": // is a horizontal pipe connecting east and west
                east(c);
                west(c);
                break;
            case "L": // is a 90-degree bend connecting north and east
                north(c);
                east(c);
                break;
            case "J": // is a 90-degree bend connecting north and west
                north(c);
                west(c);
                break;
            case "7": // is a 90-degree bend connecting south and west
                south(c);
                west(c);
                break;
            case "F": // is a 90-degree bend connecting south and east
                south(c);
                east(c);
                break;
            case ".": // is ground; there is no pipe in this tile.
                //do nothing
                break;
            case "S": // is the starting position of the animal
                s = c;
                break;
            default:
                console.warn("unknown Tube", c);
        }
    });
    let oldMist = -1, newMist = 0;
    while (oldMist != (newMist = cells.flat().filter(c => c.value == ".").length)) {
        sanitize(cells);
        oldMist = newMist;
    }
    cells.flat().filter(c => c.adjacent.has(s)).forEach(c => s.adjacent.add(c));
    return [s, cells];
}

const sanitize = (map: TNode[][]) => {
    const cells = map.flat();
    cells.forEach(c => {
        if (c.value != "S" && (c.adjacent.size != 2 || ![...c.adjacent.values()].every(n => n.adjacent.has(c) || n.value == "S"))) {
            map[c.row][c.column].value = ".";
            map[c.row][c.column].adjacent.clear();
        }
    })
}

const maxDistance = (start: TNode, map: TNode[][]) => {
    const queue = [start];
    const distance = Array.from(map).map((_, i) => Array.from(map[i]).map(__ => -1));
    distance[start.row][start.column] = 0;
    while (queue.length > 0) {
        const current = queue.shift();
        current.tube = true;
        [...current.adjacent].filter(({row, column}) => distance[row][column] == -1).forEach(
            neighbour => {
                queue.push(neighbour);
                distance[neighbour.row][neighbour.column] = distance[current.row][current.column] + 1;
            }
        )
    }
    return distance.flat().reduce((a, b) => Math.max(a, b), -1);
}

const toScaled = ({row, column}: TCoord): TCoord => {
    return {row: 1 + 2 * row, column: 1 + 2 * column}
}
const scaleUp = (map: TNode[][]): TNode[][] => {
    const result = Array.from({length: map.length * 2 + 1}).map((_, i) => Array.from({length: map[0].length * 2 + 1}).map((__, j) => {
        return {row: i, column: j, value: ".", adjacent: new Set<TNode>(), tube: false, flooded: false};
    }));
    map.flat().forEach(oldNode => {
        const up = toScaled(oldNode);
        const upNode = result[up.row][up.column];
        upNode.value = oldNode.value;
        upNode.tube = oldNode.tube;
        oldNode.adjacent.forEach(n => {
                if (n.row == oldNode.row + 1) {
                    result[up.row + 1][up.column].value = "|"
                    result[up.row + 1][up.column].tube = true
                }
                if (n.column == oldNode.column + 1) {
                    result[up.row][up.column + 1].value = "-"
                    result[up.row][up.column + 1].tube = true
                }
            }
        )
    });
    result.flat().forEach(n => {
        [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([r, c]) => [n.row + r, n.column + c])
            .filter(([r, c]) => r >= 0 && r < result.length && c >= 0 && c < result[0].length)
            .forEach(([r, c]) => n.adjacent.add(result[r][c]))
    })
    return result;
}

const floodMap = (map: TNode[][]) => {
    const queue = [map[0][0]];
    map[0][0].value = "O";
    while (queue.length > 0) {
        const current = queue.shift();
        [...current.adjacent].filter(n => !n.flooded && !n.tube).forEach(n => {
            n.flooded = true;
            queue.push(n);
        })
    }
    return map;
}

const scaleDown = (map: TNode[][]) => {
    return map.filter((n, i) => i % 2 == 1).map(row => row.filter((n, i) => i % 2 == 1));
}
const printMap = (map: TNode[][]) => {
    console.log(map.map(row => row.map(c => c.tube ? `\x1b[45m${c.value}\x1b[0m` : (c.flooded ? `\x1b[44m${c.value}\x1b[0m` : c.value)).join("")).join("\n"));
}

const countUnflooded = (map: TNode[][]) => {
    return map.flat().filter(t => !t.flooded && !t.tube).length;
}
const solve = (data: string) => {
    const [start, map] = parse(data);
    const tube = maxDistance(start, map);
    console.log("Star 1: ", tube);
    const flooded = scaleDown(floodMap(scaleUp(map)));
    // printMap(flooded)
    console.log("Star 2: ", countUnflooded(flooded));

}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Example3");
console.log("Example3")
solve(exampleData3);
console.timeEnd("Example3")
console.time("Example4");
console.log("Example4")
solve(exampleData4);
console.timeEnd("Example4")
console.time("Example5");
console.log("Example5")
solve(exampleData5);
console.timeEnd("Example5")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
