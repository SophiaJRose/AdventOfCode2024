export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
function solution(input, removals) {
    try {
        let lines = input.trim().split("\n");
        let safeReports = 0;
        for (let line of lines) {
            let levels;
            levels = line.split(" ").map((x) => Number(x));
            if (levels.some((x) => Number.isNaN(x))) {
                console.log("Inputs contains NaNs.");
                return "Error parsing input";
            }
            if (isSafe(levels)) {
                safeReports++;
            }
            else if (removals) {
                for (let i = 0; i < levels.length; i++) {
                    let levelsCopy = levels.slice();
                    levelsCopy.splice(i, 1);
                    if (isSafe(levelsCopy)) {
                        safeReports++;
                        break;
                    }
                }
            }
        }
        return String(safeReports);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function isSafe(levels) {
    let lastDiff = 0;
    for (let i = 1; i < levels.length; i++) {
        let diff = levels[i] - levels[i - 1];
        if (diff == 0 || Math.abs(diff) > 3 || diff * lastDiff < 0) {
            return false;
        }
        lastDiff = diff;
    }
    return true;
}
