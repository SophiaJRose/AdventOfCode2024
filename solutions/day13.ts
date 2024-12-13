export function partOne(input: string): string {
    return solution(input, false);
}

export function partTwo(input: string): string {
    return solution(input, true);
}

export function solution(input: string, farPrizes: boolean): string {
    try {
        let machines: string[] = input.trim().split("\n\n");
        let totalTokens: number = 0;
        for (let machine of machines) {
            let lines: string[] = machine.split("\n");
            const buttonARegex = /Button A: X\+(\d*), Y\+(\d*)/;
            const buttonBRegex = /Button B: X\+(\d*), Y\+(\d*)/;
            const prizeRegex = /Prize: X\=(\d*), Y\=(\d*)/;
            let buttonAMatches = lines[0].match(buttonARegex);
            let buttonBMatches = lines[1].match(buttonBRegex);
            let prizeMatches = lines[2].match(prizeRegex);
            if (buttonAMatches == null) {
                console.log(`Button A could not be parsed: ${lines[0]}`);
                return "Error parsing input";
            }
            if (buttonBMatches == null) {
                console.log(`Button B could not be parsed: ${lines[1]}`);
                return "Error parsing input";
            }
            if (prizeMatches == null) {
                console.log(`Prize location could not be parsed: ${lines[2]}`);
                return "Error parsing input";
            }
            let buttonA: number[] = [Number(buttonAMatches[1]), Number(buttonAMatches[2])];
            let buttonB: number[] = [Number(buttonBMatches[1]), Number(buttonBMatches[2])];
            let prize: number[] = farPrizes ? [Number(prizeMatches[1]) + 10000000000000, Number(prizeMatches[2]) + 10000000000000] : [Number(prizeMatches[1]), Number(prizeMatches[2])];
            let a = (prize[0] * buttonB[1] - prize[1] * buttonB[0]) / (buttonA[0] * buttonB[1] - buttonA[1] * buttonB[0]);
            let b = (prize[1] * buttonA[0] - prize[0] * buttonA[1]) / (buttonA[0] * buttonB[1] - buttonA[1] * buttonB[0]);
            console.log(`${a}, ${b}`);
            if (a % 1 == 0 && b % 1 == 0) {
                totalTokens += (3 * a) + b;
            }
        }
        return String(totalTokens);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}