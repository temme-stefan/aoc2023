import {exampleData, exampleData2, exampleData3, starData} from "./08-data";
import {kgV} from "../usefull/numeric";


const parse = (data: string) => {
    const [instructionPart, nodePart] = data.split("\n\n");
    const instructions = instructionPart.split("") as ("L" | "R")[];
    const nodes = Object.fromEntries(nodePart.split("\n").map(row => {
        const [, name, left, right] = /(\S{3}) = \((\S{3}), (\S{3})\)/.exec(row);
        return [name, {L: left, R: right}];
    }))
    return {instructions, nodes};
}

const walk = ({instructions, nodes}: ReturnType<typeof parse>,start) => {
    let steps = 0;
    let instructionStep = 0
    let currentNode = start;
    if (nodes[start]) {
        while (!currentNode.endsWith("Z")) {
            currentNode = nodes[currentNode][instructions[instructionStep]];
            instructionStep = (instructionStep + 1) % instructions.length;
            steps++;
        }
    }
    else{
        console.warn("startnode not found",start);
    }
    return steps;
}

const walkAll = ({instructions, nodes}: ReturnType<typeof parse>) => {
    const startNodes = Object.keys(nodes).filter(key=> key.endsWith("A"));
    const wayLength =  startNodes.map(n=>walk({instructions,nodes},n));
    return wayLength.reduce(kgV);
}
const solve = (data: string) => {
    const parsed = parse(data);
    console.log("Star 1: ", walk(parsed,"AAA"));
    console.log("Star 2: ", walkAll(parsed));
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

console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
