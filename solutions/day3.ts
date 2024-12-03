export function partOne(input: string): string {
    return solution(input, false);
}

export function partTwo(input: string): string {
    return solution(input, true);
}

function solution(input: string, disable: boolean): string {
    try {
        let code: string = input.trim();
        let total: number = 0;
        let doMul: boolean = true;
        const uncorrupted: RegExp = /(?:mul\((\d+),(\d+)\))|(?:do\(\))|(?:don\'t\(\))/g;
        let matches = code.matchAll(uncorrupted);
        for (let match of matches) {
            if (match[0] == "do()" && disable) {
                doMul = true;
            } else if (match[0] == "don't()" && disable) {
                doMul = false;
            } else if (match[0].startsWith("mul(") && doMul){
                total += Number(match[1]) * Number(match[2]);
            }
        }
        return String(total);
    } catch (err) {
        console.log(err);
        return "Error when solving";
    }
}