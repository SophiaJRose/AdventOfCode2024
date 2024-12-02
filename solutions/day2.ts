export function partOne(input: string): string {
    return solution(input, false);
}

export function partTwo(input: string): string {
    return solution(input, true);
}

function solution(input: string, removals: boolean): string {
    try {
        let lines: string[] = input.trim().split("\n");
        let safeReports: number = 0;
        for (let line of lines) {
            let levels: number[];
            levels = line.split(" ").map((x) => Number(x));
            if (levels.some((x) => Number.isNaN(x))) {
                console.log("Inputs contains NaNs.");
                return "Error parsing input."
            }
            let unsafe: number = findUnsafe(levels);
            if (unsafe == -1) {
                safeReports++;
            } else if (removals) {
                for (let i = 0; i < levels.length; i++) {
                    let levelsCopy = levels.slice();
                    levelsCopy.splice(i,1);
                    if (findUnsafe(levelsCopy) == -1) {
                        safeReports++;
                        break;
                    }
                }
            }
        }
        return String(safeReports)
    } catch (err) {
        console.log(err);
        return "Error when solving";
    }
}

function findUnsafe(levels: number[]): number {
    let lastDiff: number = 0;
    for (let i = 1; i < levels.length; i++) {
        let diff: number = levels[i] - levels[i-1];
        if (diff == 0 || Math.abs(diff) > 3 || diff * lastDiff < 0) {
            return i;
        }
        lastDiff = diff;
    }
    return -1;
}