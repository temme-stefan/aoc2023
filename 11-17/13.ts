import {exampleData, starData} from "./13-data";

const parse = (data: string) => {
    return data.split("\n\n").map(map => {
        const rows = map.split("\n");
        const columns = rows[0].split("").map((_, i) => rows.map(r => r[i]).join(""));
        return {rows, columns};
    })
}

type rowColumn = ReturnType<typeof parse>[number];
const isPalindrom = (s: string) => {
    let palindrom = true;
    for (let i = 0; i < s.length / 2 && palindrom; i++) {
        palindrom = s[i] == s[s.length - 1 - i];
    }
    return palindrom;
}
const findMirrors = (strings: string[]) => {
    const cand = Array.from(strings[0]).map((_, i) => [
        {
            palindrom: strings[0].substring(0, strings[0].length - i), left: true, i
        }, {
            palindrom: strings[0].substring(i), left: false, i
        }]).flat().filter(({palindrom}) => palindrom.length % 2 == 0 && isPalindrom(palindrom));
    const allM = cand.filter(({left, i}) => strings.every(
        s => isPalindrom(left ? s.substring(0, s.length - i) : s.substring(i))
    ))
    return allM.map(m => {
        return m.left ? m.palindrom.length / 2 : strings[0].length - m.palindrom.length / 2;
    });
}

const getMirror = ({rows, columns}: rowColumn) => {
    return [findMirrors(rows).map(r => {
        return {mirrorAt: r, row: true}
    }), findMirrors(columns).map(r => {
        return {mirrorAt: r, row: false}
    })].flat(1);
}
type mirror = ReturnType<typeof getMirror>[number];
const swapAt = (row: number, column: number, map: rowColumn) => {
    const rows = Array.from(map.rows);
    const columns = Array.from(map.columns);
    rows[row] = rows[row].substring(0, column) + (rows[row][column] == "." ? "#" : ".") + rows[row].substring(column + 1);
    columns[column] = columns[column].substring(0, row) + (columns[column][row] == "." ? "#" : ".") + columns[column].substring(row + 1);
    return {rows, columns}
}

const solve = (data: string) => {
    const parsed = parse(data);
    const reducer = (a: number, b: mirror[]) => a + (b[0].row ? 1 : 100) * b[0].mirrorAt;
    const star1 = parsed.map(getMirror);
    console.log("Star 1: ", star1.reduce(reducer, 0));
    const star2 = parsed.map(map => {
        let found: mirror[] = null
        const originalMirror = getMirror(map)[0];
        for (let i = 0; !found && i < map.rows.length; i++) {
            for (let j = 0; !found && j < map.columns.length; j++) {
                const nextMap = swapAt(i, j, map);
                const mirrors = getMirror(nextMap)
                    .filter(({mirrorAt, row}) => !(mirrorAt == originalMirror.mirrorAt && row == originalMirror.row));
                if (mirrors.length > 0) {
                    found = mirrors
                }
            }
        }
        return found;
    })
    console.log("Star 2: ", star2.reduce(reducer, 0));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
