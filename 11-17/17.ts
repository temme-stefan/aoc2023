import {exampleData, starData} from "./17-data";

type Node = { row: number, column: number, value: number, adjacent: Node[] }
const parse = (data: string):Node[] => {
    const nodeMap:Node[][] = data.split("\n").map((r, row) => r.split("").map((c, column) => {
        return {row, column, value: parseInt(c), adjacent: []}
    }));
    const validPairs = ([row, column]: [number, number]) =>
        row >= 0 && column >= 0 && row < nodeMap.length && column < nodeMap[row].length
    const getAdjacent = (node: Node) =>
        [[-1, 0], [1, 0], [0, -1], [0, 1]]
            .map(([r, c]) => [r + node.row, c + node.column])
            .filter(validPairs)
            .map(([r, c]) => nodeMap[r][c])
    const nodes = nodeMap.flat();
    nodes.forEach(n => n.adjacent = getAdjacent(n));
    return nodes;

}
const solve = (data: string) => {

}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
