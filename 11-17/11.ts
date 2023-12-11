import {exampleData, starData} from "./11-data";

type Node = { row: number, column: number }
type Edge = { nodes: Set<Node>, cost: number }

const getEdges = (expansion: number, nodes: Node[], voidRows: number[], voidColumns: number[]) => {
    const edges: Edge[] = []
    nodes.forEach((n1, i) => nodes.filter((n2, j) => j > i).forEach(n2 => {
        if (n1 != n2) {
            const deltaX = Math.abs(n1.row - n2.row) + voidRows.filter(r => r > Math.min(n1.row, n2.row) && r < Math.max(n1.row, n2.row)).length * (expansion - 1);
            const deltaY = Math.abs(n1.column - n2.column) + voidColumns.filter(r => r > Math.min(n1.column, n2.column) && r < Math.max(n1.column, n2.column)).length * (expansion - 1);
            edges.push({nodes: new Set([n1, n2]), cost: deltaX + deltaY});
        }
    }))
    return edges;
}

const parse = (data: string) => {
    const splitted = data.split("\n").map(row => row.split(""));
    const voidRows = splitted.map((r, i) => {
        return {r, i};
    }).filter(({r}) => r.every(c => c == ".")).map(({i}) => i);
    const voidColumns = splitted[0].map((_, i) => {
        return {r: splitted.map(r => r[i]), i}
    }).filter(({r}) => r.every(c => c == ".")).map(({i}) => i);
    const nodes: Node[] = [];
    for (let i = 0; i < splitted.length; i++) {
        for (let j = 0; j < splitted[i].length; j++) {
            if (splitted[i][j] == "#") {
                nodes.push({row: i, column: j});
            }
        }
    }
    return {nodes, voidRows, voidColumns}
}
const solve = (data: string) => {
    const {nodes, voidRows, voidColumns} = parse(data);
    const star1Distances = getEdges(2, nodes, voidRows, voidColumns)
    console.log("Star 1: ", star1Distances.reduce((a, {cost}) => a + cost, 0));
    const star2Distances = getEdges(1000000, nodes, voidRows, voidColumns)
    console.log("Star 2: ", star2Distances.reduce((a, {cost}) => a + cost, 0));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
