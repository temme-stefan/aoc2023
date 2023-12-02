import {exampleData, starData} from "./02-data";

const defaultSet = {
    blue: 0,
    green: 0,
    red: 0,
}

type TSet = typeof defaultSet;
type Tgame = {
    id: number,
    sets: TSet[]
}

const parseGame = (data: string): Tgame => {
    const game = data.split(":");
    const id = parseInt(game[0].substring(5));
    const sets = game[1].split(";").map(
        set => {
            return {
                ...defaultSet,
                ...Object.fromEntries(set.split(",").map(
                        cube => [cube.split(" ").at(-1), parseInt(cube)]
                    ))
            };
        }
    );
    return {id, sets}
}
const createGameValidator = (availableCubes: TSet) => (game: Tgame) => game.sets.every(s => Object.keys(defaultSet).every(key => availableCubes[key] >= s[key]));

const getPower = (game: Tgame) => {
    const minimalNumberOfCubes = game.sets.reduce((a, set) => {
        Object.keys(defaultSet).forEach(key => a[key] = Math.max(a[key], set[key]));
        return a;
    }, {...defaultSet})
    return [...Object.values(minimalNumberOfCubes)].reduce((a, b) => a * b, 1);
}
const solve = (data: string) => {
    const isValid = createGameValidator({
        red: 12, green: 13, blue: 14
    });
    const games = data.split("\n")
        .map(parseGame);
    console.log("Star1: ", games.filter(isValid).reduce((a, b) => a + b.id, 0));
    console.log("Star2: ", games.map(getPower).reduce((a, b) => a + b, 0));

}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
