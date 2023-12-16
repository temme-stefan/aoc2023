import {exampleData, starData} from "./16-data";

enum direction {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom"
}

type Coord = {
    row: number, column: number
}
type Cell = Coord & { value: string }
type Ray = Coord & { from: direction };


const toMap = (data: string): Cell[][] => {
    return data.split("\n")
        .map((row, i) => row.split("")
            .map((cell, j) => {
                return {
                    row: i, column: j, value: cell
                }
            })
        );
}

const rayToString = (ray: Ray) => `${ray.row}-${ray.column}-${ray.from}`;

const getEmptyRays = ({row, column, from}: Ray) => {
    const result: Ray[] = []
    switch (from) {
        case direction.bottom:
            result.push({row: row - 1, column, from})
            break
        case direction.left:
            result.push({row, column: column + 1, from})
            break
        case direction.top:
            result.push({row: row + 1, column, from})
            break
        case direction.right:
            result.push({row, column: column - 1, from})
            break
    }
    return result;
}

const turnLeft = ({row, column, from}: Ray): Ray => {
    switch (from) {
        case direction.top:
            return {from: direction.left, row, column: column + 1};
        case direction.left:
            return {from: direction.bottom, row: row - 1, column};
        case direction.bottom:
            return {from: direction.right, row, column: column - 1};
        case direction.right:
            return {from: direction.top, row: row + 1, column};
    }
}
const turnRight = ({row, column, from}: Ray): Ray => {
    switch (from) {
        case direction.top:
            return {from: direction.right, row, column: column - 1};
        case direction.left:
            return {from: direction.top, row: row + 1, column};
        case direction.bottom:
            return {from: direction.left, row, column: column + 1};
        case direction.right:
            return {from: direction.bottom, row: row - 1, column};
    }
}

const getMirrorRays1 = (ray: Ray) => { //  /
    if (ray.from == direction.top || ray.from == direction.bottom) {
        return [turnRight(ray)]
    } else {
        return [turnLeft(ray)]
    }
}
const getMirrorRays2 = (ray: Ray) => {// \
    if (ray.from == direction.top || ray.from == direction.bottom) {
        return [turnLeft(ray)]
    } else {
        return [turnRight(ray)]
    }
}
const getSplitterRays1 = (ray: Ray) => { // |
    if (ray.from == direction.top || ray.from == direction.bottom) {
        return getEmptyRays(ray)
    } else {
        return [turnLeft(ray), turnRight(ray)]
    }
}
const getSplitterRays2 = (ray: Ray) => { //-
    if (ray.from == direction.top || ray.from == direction.bottom) {
        return [turnLeft(ray), turnRight(ray)]
    } else {
        return getEmptyRays(ray)
    }
}

function getCountFromStart(map: Cell[][], start: { column: number; from: direction; row: number }) {
    const energyMap = Array.from(map).map(row => Array.from(row).map(_ => false));
    const dejaVue = new Set<string>();
    const rays = [start]
    const addRays = (newRays: Ray[]) => {
        newRays.filter(ray => ray.row >= 0 && ray.column >= 0 && ray.row < map.length && ray.column < map[ray.row].length)
            .filter(ray => {
                const key = rayToString(ray);
                return !dejaVue.has(key) && rays.find(({
                                                           row,
                                                           column,
                                                           from
                                                       }) => ray.row == row && ray.column == column && ray.from == from) == null
            })
            .forEach(ray => rays.push(ray));
    }
    while (rays.length > 0) {
        const ray = rays.pop();
        const key = rayToString(ray);
        dejaVue.add(key);
        const cell = map[ray.row][ray.column];
        energyMap[ray.row][ray.column] = true;
        switch (cell.value) {
            case ".":
                addRays(getEmptyRays(ray));
                break;
            case "/":
                addRays(getMirrorRays1(ray));
                break;
            case "\\":
                addRays(getMirrorRays2(ray));
                break;
            case "|":
                addRays(getSplitterRays1(ray));
                break;
            case "-":
                addRays(getSplitterRays2(ray));
                break;
        }
    }
    return energyMap.flat().filter(Boolean).length;
}

const solve = (data: string) => {
    const map = toMap(data);
    const start = {row: 0, column: 0, from: direction.left};
    const energizedCount = getCountFromStart(map, start);
    console.log("Star 1:", energizedCount)
    const starts = [
        ...map.flatMap((_,row)=>[{row,column:0,from:direction.left},{row,column:_.length-1,from:direction.right}]),
        ...map[0].flatMap((_, column)=>[{row: 0, column,from:direction.top},{row: map.length-1, column, from:direction.bottom}])
        ];
    const energie = starts.map(s=>getCountFromStart(map,s));
    console.log("Star 2:",energie.reduce((a,b)=>Math.max(a,b),0));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
