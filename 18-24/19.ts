import {exampleData, starData} from "./19-data";

type Part = { x: number, m: number, a: number, s: number, rating: number }
type Interval = [number, number];
type MinMaxPart = { x: Interval, m: Interval, a: Interval, s: Interval }
type Workflow = {
    func: (part: Part, accepted: Part[], rejected: Part[]) => string | null
    parsed?: ParseWorkflow
}
type ParseWorkflow = { key?: string, operation?: string, value?: number, followFlow: string }
type Workflows = Map<string, Workflow[]>

const parse = (data: string): { parts: Part[], workflows: Workflows } => {
    const [workflowData, partData] = data.split("\n\n");
    const parts = partData.split("\n").map(row => {
        const [, ...xmas] = /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/.exec(row);
        const [x, m, a, s] = xmas.map(s => parseInt(s));
        return {x, m, a, s, rating: x + m + a + s}
    })
    const workflows: Workflows = new Map();

    workflows.set("A", [{
        func: (part: Part, accepted: Part[], rejected: Part[]) => {
            accepted.push(part);
            return ""
        }
    }]);
    workflows.set("R", [{
        func: (part: Part, accepted: Part[], rejected: Part[]) => {
            rejected.push(part);
            return ""
        }
    }]);
    workflowData.split("\n").forEach(row => {
        const [, name, stepData] = /^(.*)\{(.*)\}$/.exec(row);
        const steps: Workflow[] = stepData.split(",").map(step => {
            const m = /^(([xmas])([<>])(\d+):)?(.*)$/.exec(step);
            const result: Workflow = {
                func: null,
                parsed: {followFlow: m[5]}
            }

            if (m[1] == null) {
                result.func = (part: Part, accepted: Part[], rejected: Part[]) => {
                    return m[5];
                }
            } else {
                result.parsed.key = m[2];
                result.parsed.operation = m[3];
                result.parsed.value = parseInt(m[4]);
                result.func = (part: Part, accepted: Part[], rejected: Part[]) => {
                    const value = part[m[2]];
                    const operation = m[3];
                    const secondArg = parseInt(m[4]);
                    if (operation == "<" && value < secondArg || operation == ">" && value > secondArg) {
                        return m[5];
                    }
                }
            }
            return result;
        })
        workflows.set(name, steps);
    })
    return {parts, workflows}
}

function walkParts(parts: Part[], workflows: Map<string, Workflow[]>) {
    const accepted: Part[] = [], rejected: Part[] = [];
    for (const part of parts) {
        let nextFlow = "in";
        while (workflows.has(nextFlow)) {
            const flow = workflows.get(nextFlow);
            let flowResult = null, i = 0;
            while (flowResult == null && i < flow.length) {
                flowResult = flow[i].func(part, accepted, rejected);
                i++;
            }
            nextFlow = flowResult;
        }
    }
    const score = accepted.reduce((a, {rating}) => a + rating, 0)
    return score;
}

const getAcceptanceForEnd = (workflows:Workflows,workflow: Workflow, accept: MinMaxPart) => {
    if (workflow.parsed.key){

    }
    else{

    }
}

const solve = (data: string) => {
    const {parts, workflows} = parse(data);
    const score = walkParts(parts, workflows);
    console.log("Star 1:", score);
    const acceptance = {x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]};
    const flowsTo = (state: string) => [...workflows.values()].flat().filter(w => w.parsed.followFlow == state)
    const ends = flowsTo("A");


}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
