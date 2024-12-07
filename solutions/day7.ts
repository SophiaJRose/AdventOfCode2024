export function partOne(input: string): string {
    try {
        let lines: string[] = input.trim().split("\n");
        let total: number = 0;
        for (let line of lines) {
            let target: number = Number(line.split(": ")[0]);
            let values: number[] = line.split(": ")[1].split(" ").map(Number);
            if (Number.isNaN(target) || values.some(Number.isNaN)) {
                console.log("Input contains NaNs.");
                return "Error parsing input"
            }
            let operators: number = 0;
            let accum: number = 0;
            while (operators < 2 ** (values.length - 1)) {
                accum = values[0];
                for (let i = 1; i < values.length; i++) {
                    let opFlag = 1 << (i - 1);
                    if ((operators & opFlag) == opFlag) {
                        accum *= values[i];
                    } else {
                        accum += values[i];
                    }
                }
                if (accum == target) {
                    total += target;
                    break;
                }
                operators++;
            }
        }
        return String(total);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

export function partTwo(input: string): string {
    try {
        let lines: string[] = input.trim().split("\n");
        let total: number = 0;
        for (let line of lines) {
            let target: number = Number(line.split(": ")[0]);
            let values: number[] = line.split(": ")[1].split(" ").map(Number);
            if (Number.isNaN(target) || values.some(Number.isNaN)) {
                console.log("Input contains NaNs.");
                return "Error parsing input"
            }
            let operators: number = 0;
            let accum: number = 0;
            while (operators < 3 ** (values.length - 1)) {
                accum = values[0];
                for (let i = 1; i < values.length; i++) {
                    let ternDigit = Math.floor((operators % (3 ** i)) / (3 ** (i-1)));
                    if (ternDigit == 2) {
                        accum = Number(String(accum) + String(values[i]));
                    } else if (ternDigit == 1) {
                        accum *= values[i];
                    } else {
                        accum += values[i];
                    }
                }
                if (accum == target) {
                    total += target;
                    break;
                }
                operators++;
            }
        }
        return String(total);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}