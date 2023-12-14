import { exampleData, starData} from "./12-data";

const parse = (data: string) => {
    return data.split("\n").map(row => {
        const [text, numberPart] = row.split(" ");
        return {text, numbers: numberPart.split(",").map(n => parseInt(n))}
    })
}
type Representation = ReturnType<typeof parse>[number];
console.error = (...args) => console.log("\x1b[45mError: ", ...args, "\x1b[0m")


const simplify = ({text, numbers}: Representation): Representation => {
    const textParts = text.split(/\.+/).filter(s => s);
    const numberC = Array.from(numbers);
    let oldLength = numberC.length;
    debug && console.log("simplify", text, numbers);
    do {
        oldLength = numberC.length;
        while (textParts.length && textParts[0]?.length == numberC[0] && textParts[0].includes("#")) {
            numberC.shift();
            textParts.shift()

        }
        while (textParts.length && textParts.at(-1)?.length == numberC.at(-1) && textParts.at(-1).includes("#")) {
            numberC.pop();
            textParts.pop()
        }
        if (textParts[0]?.match(/^#+$/) || textParts.at(-1)?.match(/^#+$/)) {
            debug && console.error(textParts, numberC)
            throw "illegal Representation";
        }

        while (textParts.length && textParts[0]?.startsWith("#")) {
            const number = numberC.shift();
            switch (true) {
                case textParts[0].length < number:
                    debug && console.error(textParts, number)
                    throw "illegal Representation";
                default:
                    textParts[0] = textParts[0].substring(number);
                    if (textParts[0][0] == "#") {
                        debug && console.error(textParts, number)
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
                    debug && console.error(textParts, number)
                    throw "illegal Representation";
                default:
                    const i = textParts.length - 1;
                    textParts[i] = textParts[i].substring(0, textParts[i].length - number);
                    if (textParts[i].at(-1) == "#") {
                        debug && console.error(textParts, number)
                        throw "illegal Representation";
                    } else {
                        textParts[i] = textParts[i].substring(0, textParts[i].length - 1);
                    }
                    break;
            }
        }
        while (textParts.length && textParts.at(0).length == 0) {
            textParts.shift();
        }
        while (textParts.length && textParts.at(-1).length == 0) {
            textParts.pop();
        }
    } while (oldLength != numberC.length);
    debug && console.log("to", textParts.join("."), numberC);
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

const cache: Map<string, Map<string, number>> = new Map();
const walk = (repr: Representation) => {
    if (!cache.has(repr.text)) {
        cache.set(repr.text, new Map());
    }
    const numberKey = repr.numbers.join("-");
    if (cache.get(repr.text).has(numberKey)) {
        return cache.get(repr.text)!.get(numberKey)!;
    }

    try {
        const {
            text, numbers
        } = simplify(repr)
        if (text == "") {
            if (numbers.length == 0) {
                debug && console.log("counted")
                return 1;
            } else {
                debug && console.error("invalid representation", "empty Text", numbers)
                return 0
            }
        } else {
            const {dot, sharp} = removeFirstQuestionaire(text);
            const count = walk({text: dot, numbers}) + walk({text: sharp, numbers});
            debug && console.log(repr.text, " : ", count)
            cache.get(repr.text).set(numberKey, count);
            return count;
        }
    } catch
        (e) {
        return 0;
    }
}

const unfold = (parsed: Representation[]) => parsed.map(({text, numbers}) => {
    const textUnfolded = [text, text, text, text, text].join("?");
    const numbersUnfolded = [...numbers, ...numbers, ...numbers, ...numbers, ...numbers];
    return {
        text: textUnfolded,
        numbers: numbersUnfolded
    }
})

const solve = (data: string) => {
    const parsed = parse(data);
    const possibilities = parsed.map(p => walk(p));
    // console.log(possibilities);
    console.log("Star 1: ", possibilities.reduce((a, b) => a + b, 0));
    const unfolded = unfold(parsed);
    const morePossibilities = unfolded.map(p => walk(p));
    // console.log(morePossibilities);
    console.log("Star 2: ", morePossibilities.reduce((a, b) => a + b, 0));
}
const debug = false;

console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
