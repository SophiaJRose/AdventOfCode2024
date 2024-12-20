export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
function solution(input, disable) {
    try {
        let code = input.trim();
        let total = 0;
        let doMul = true;
        const uncorrupted = /(?:mul\((\d+),(\d+)\))|(?:do\(\))|(?:don\'t\(\))/g;
        let matches = code.matchAll(uncorrupted);
        for (let match of matches) {
            if (match[0] == "do()" && disable) {
                doMul = true;
            }
            else if (match[0] == "don't()" && disable) {
                doMul = false;
            }
            else if (match[0].startsWith("mul(") && doMul) {
                total += Number(match[1]) * Number(match[2]);
            }
        }
        return String(total);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
