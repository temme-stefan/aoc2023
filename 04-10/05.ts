import {exampleData, starData} from "./05-data";

const toNumbers = (spacedNumbers: string) => spacedNumbers.split(" ").filter(s => s.length > 0).map(s => parseInt(s));

type TIntervall = {
    start: number,
    range: number,
    inRange: (n: number) => boolean,
    map: (other: TIntervall,target:number) => TIntervall[]
}

const intervall = (start: number, range: number): TIntervall => {
    const inRange = (n) => start <= n && n < start + range
    return {
        start, range,
        inRange,
        map: (other,target) => {
            const firstInside = inRange(other.start);
            const lastInside = inRange(other.start+other.range-1);
            switch (true){
                case firstInside&&lastInside:
                    return [intervall(target+other.start-start ,other.range)]
                    break;
                case !firstInside && lastInside:
                    return [];
                    break;
                case firstInside && !lastInside:
                    return [];
                    break;
                default: return [other];
            }
        }
    }
}

function inRange(n: number, start: number, range: number) {
    return start <= n && n < start + range;
}

const parse = (data: string) => {
    const [seedPart, ...mapperParts] = data.split("\n\n");
    const seeds = toNumbers(seedPart.split(":")[1]);
    const mappers = mapperParts.map(part => {
        const [name, ...rows] = part.split("\n");
        const maps = rows.map(row => {
            const [destinationStart, sourceStart, range] = toNumbers(row);
            return {
                destinationStart, sourceStart, range,
                filter: (n: number) => inRange(n, sourceStart, range),
                map: (n: number) => destinationStart + n - sourceStart
            };
        });
        return {
            name, maps, map: (n: number) => maps.find(m => m.filter(n))?.map(n) ?? n
        }
    });
    return {
        seeds, mappers,
        mapAll: (numbers: number[]) => numbers.map(n => mappers.reduce((mapped, mapper) => mapper.map(mapped), n))
    }
}

type Mapping = ReturnType<typeof parse>;
type Map = Mapping['mappers'][number]["maps"];
type Intervall = [number,number];
const splitIntervalAt = ([a, b]:Intervall, at:number):Intervall[] => [[a, at-1], [at , b]];
const applyMap = (interval:Intervall,map: Map)=>{
    let newIntervalls:Intervall[] = [];
    let untouchedIntervalls:Intervall[] = [interval];
    map.forEach(({sourceStart,  range})=>{
        const temp:Intervall[] = []
        untouchedIntervalls.forEach(([a,b])=>{
            const aInRange = sourceStart <= a && a < sourceStart + range
            const bInRange = sourceStart <= b && b < sourceStart + range
            const intervalOverlappes = a < sourceStart && b > sourceStart + range
            switch (true) {
                case aInRange && bInRange: // volltreffer
                    newIntervalls.push([a, b]);
                    break;
                case !aInRange && bInRange: { // links halb raus
                    const [outOfRange, inRange] = splitIntervalAt([a, b], sourceStart );
                    temp.push(outOfRange);
                    newIntervalls.push(inRange);
                    break;
                }
                case aInRange && !bInRange: { // rechts halb raus
                    const [inRange, outOfRange] = splitIntervalAt([a, b], sourceStart + range );
                    newIntervalls.push(inRange);
                    temp.push(outOfRange);
                    break;
                }
                case intervalOverlappes: {
                    const [left, rest] = splitIntervalAt([a, b], sourceStart );
                    const [center, right] = splitIntervalAt(rest, sourceStart + range );
                    temp.push(left,right);
                    newIntervalls.push(center);
                    break;
                }
                default:
                    temp.push([a, b])
                    break;
            }
        });
        untouchedIntervalls = temp;
    });
    newIntervalls= newIntervalls.map(i=>{
        const row = map.find(r=>r.filter(i[0]));
        return i.map(row.map) as Intervall;
    })

    return [...untouchedIntervalls,...newIntervalls];
}

const star2 = (parsedData: Mapping) => {
    const seedPairs: [number, number][] = [];
    for (let i = 0; i < parsedData.seeds.length; i += 2) {
        seedPairs.push([parsedData.seeds[i],parsedData.seeds[i]+parsedData.seeds[i + 1]-1]);
    }
    return seedPairs.flatMap(intervall=>{
        // console.log("Start",intervall);
        let intervalls= [intervall];
        parsedData.mappers.forEach(mapper=>{
            intervalls = intervalls.flatMap(i=>applyMap(i,mapper.maps))
            // console.log("After ", mapper.name,intervalls.length)
        })
        return intervalls;
    }).reduce((a,i)=>Math.min(a,i[0]),Number.MAX_SAFE_INTEGER)

}
const solve = (data: string) => {
    const parsed = parse(data);
    console.log("Star 1: ", parsed.mapAll(parsed.seeds).reduce((a, b) => a < b ? a : b, Number.MAX_SAFE_INTEGER));
    console.log("Star 2: ", star2(parsed));
}
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
