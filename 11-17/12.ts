import {exampleData, starData} from "./12-data";

const parse = (data: string) => {
    return data.split("\n").map(row => {
        const [text, numberPart] = row.split(" ");
        return {text, numbers: numberPart.split(",").map(n => parseInt(n))}
    })
}
type Representation = ReturnType<typeof parse>[number];

const simplify = ({text, numbers}: Representation): Representation => {
    const textParts = text.split(/\.+/).filter(s => s);
    const numberC = Array.from(numbers);
    let oldLength = numberC.length;
    do {
        oldLength = numberC.length;
        while (textParts.length && textParts[0]?.length == numberC[0]) {
            numberC.shift();
            textParts.shift()

        }
        while (textParts.length && textParts.at(-1)?.length == numberC.at(-1)) {
            numberC.pop();
            textParts.pop()
        }
        if (textParts[0]?.match(/^#+$/) || textParts.at(-1)?.match(/^#+$/)) {
            console.error(textParts, numberC)
            throw "illegal Representation";
        }

        while (textParts.length && textParts[0]?.startsWith("#")) {
            const number = numberC.shift();
            switch (true) {
                case textParts[0].length < number:
                    console.error(textParts, number)
                    throw "illegal Representation";
                    break;
                default:
                    textParts[0] = textParts[0].substring(number);
                    if (textParts[0].at(-1) == "#") {
                        console.error(textParts, number)
                        throw "illegal Representation";
                    } else {
                        textParts[0] = textParts[0].substring(1)
                    }
                    break;
            }
        }

        while (textParts.length && textParts.at(-1)?.endsWith("#")) {
            const number = numberC.pop();
            switch (true) {
                case textParts.at(-1).length < number:
                    console.error(textParts, number)
                    throw "illegal Representation";
                    break;
                default:
                    const i = textParts.length - 1;
                    textParts[i] = textParts[i].substring(0, textParts[i].length - number);
                    if (textParts[i][0] == "#") {
                        console.error(textParts, number)
                        throw "illegal Representation";
                    } else {
                        textParts[i] = textParts[i].substring(0, textParts[i].length - 1);
                        ;
                    }
                    break;
            }
        }
    } while (oldLength != numberC.length);
    return {
        text: textParts.join("."),
        numbers: numberC
    }
}

const removeFirstQuestionaire = (text: string) => {
    const questInd = text.indexOf("?");
    const start = text.substring(0, questInd);
    const end = text.substring(questInd + 1);
    return {
        dot: `${start}.${end}`,
        sharp: `${start}#${end}`
    }
}

const walk = (repr: Representation) => {
    try {
        const {
            text, numbers
        } = simplify(repr)
        if (text == "") {
            return numbers.length == 0 ? 1 : 0;
        } else {
            const {dot, sharp} = removeFirstQuestionaire(text);
            return walk({text: dot, numbers}) + walk({text: sharp, numbers});
        }
    } catch
        (e) {
        return 0;
    }
}

const solve = (data: string) => {
    const parsed = parse(data);
    console.log(parsed.map(p => walk(p)))
    ;
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
// console.time("Stardata");
// console.log("Stardata")
// solve(starData);
// console.timeEnd("Stardata");
