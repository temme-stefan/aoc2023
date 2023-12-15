import {exampleData, starData} from "./15-data";

const hash = (data: string) => {
    return data.split("").reduce((a, b) => ((a + b.charCodeAt(0)) * 17) % 256, 0)
}

const getBoxes = (data: string) => {
    const lenses = data.split(",").map(l => {
        const [, label, operation, optionalNumber] = l.match(/(.*)([-=])(\d*)/);
        return {
            label,
            operation,
            focalLength: optionalNumber.length > 0 ? parseInt(optionalNumber) : null,
            hash: hash(label)
        }
    });
    const boxes = new Map<number, typeof lenses[number][]>();
    for (const lens of lenses) {
        const box = boxes.get(lens.hash) ?? boxes.set(lens.hash, []).get(lens.hash);
        const lensAt = box.findIndex(l => l.label == lens.label);
        switch (lens.operation) {
            case "=":
                if (lensAt >= 0) {
                    box.splice(lensAt, 1, lens);
                } else {
                    box.push(lens)
                }
                break;
            case "-":
                if (lensAt >= 0) {
                    box.splice(lensAt, 1);
                }
                break;
        }
    }
    return boxes;

}
const solve = (data: string) => {
    console.log("Star 1: ", data.split(",").map(hash).reduce((a, b) => a + b, 0));
    const boxes = getBoxes(data);
    console.log("Star 2: ", [...boxes.entries()].reduce((a, [boxIndex, box]) => a + (boxIndex + 1) * box.reduce((a, {focalLength}, i) => a + (i + 1) * focalLength, 0), 0))
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
