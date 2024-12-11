export function partOne(input: string): string {
    return solution(input, 25);
}

export function partTwo(input: string): string {
    return solution(input, 75);
}

function addOrSet(map: Map<any, number>, key: any, amount: number) {
    let count: number | undefined = map.get(key);
    if (count != undefined) {
        map.set(key, count+amount);
    } else {
        map.set(key, amount);
    }
}

function solution(input: string, blinks: number): string {
    try {
        let stones: number[] = input.trim().split(" ").map(Number);
        if (stones.some((x) => Number.isNaN(x))) {
            console.log("Input contains NaNs");
            return "Error parsing input"
        }
        let stoneMap: Map<number, number> = new Map();
        for (let stone of stones) {
            addOrSet(stoneMap, stone, 1);
        }
        for (let i = 0; i < blinks; i++) {
            let newMap: Map<number, number> = new Map();
            stoneMap.forEach((value, key) => {
                if (key == 0) {
                    addOrSet(newMap, 1, value);
                } else if ((Math.floor(Math.log10(key)) % 2) == 1) {
                    let halfLength: number = Math.pow(10, Math.ceil(Math.floor(Math.log10(key)) / 2));
                    addOrSet(newMap, Math.floor(key / halfLength), value);
                    addOrSet(newMap, key % halfLength, value);
                } else {
                    addOrSet(newMap, key * 2024, value);
                }
            })
            stoneMap = newMap;
        }
        let total: number = 0;
        for (let value of stoneMap.values()) {
            total += value;
        }
        return String(total);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}