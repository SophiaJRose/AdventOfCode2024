export function partOne(input: string): string {
    let registerA: number = 0;
    let registerB: number = 0;
    let registerC: number = 0;
    let program: number[] = [];
    try {
        let lines: string[] = input.trim().split("\n");
        const registerARegex = /Register A\: (\d+)/
        const registerBRegex = /Register B\: (\d+)/
        const registerCRegex = /Register C\: (\d+)/
        const programRegex = /Program\: ((?:\d+\,)*\d+)/
        let registerAMatch = lines[0].match(registerARegex);
        let registerBMatch = lines[1].match(registerBRegex);
        let registerCMatch = lines[2].match(registerCRegex);
        let programMatch = lines[4].match(programRegex);
        if (registerAMatch == null) {
            throw new Error(`Register A could not be parsed: ${lines[0]}`);
        }
        if (registerBMatch == null) {
            throw new Error(`Register B could not be parsed: ${lines[1]}`);
        }
        if (registerCMatch == null) {
            throw new Error(`Register C could not be parsed: ${lines[2]}`);
        }
        if (programMatch == null) {
            throw new Error(`Program could not be parsed: ${lines[4]}`);
        }
        registerA = Number(registerAMatch[1]);
        registerB = Number(registerBMatch[1]);
        registerC = Number(registerCMatch[1]);
        program = programMatch[1].split(",").map(Number);
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let instrPointer: number = 0;
        let output: string[] = [];
        while (instrPointer < program.length) {
            let instruction = program[instrPointer];
            let operand = program[instrPointer+1];
            let comboOperand: number = operand;
            switch (comboOperand) {
                case 4:
                    comboOperand = registerA;
                    break;
                case 5:
                    comboOperand = registerB;
                    break;
                case 6:
                    comboOperand = registerC;
                    break;
            }
            switch (instruction) {
                case 0:
                    registerA = Math.floor(registerA / (2 ** comboOperand));
                    instrPointer += 2;
                    break;
                case 1:
                    registerB = registerB ^ operand;
                    instrPointer += 2;
                    break;
                case 2:
                    registerB = (comboOperand + 8) % 8;
                    instrPointer += 2;
                    break;
                case 3:
                    if (registerA != 0) {
                        instrPointer = operand;
                    } else {
                        instrPointer += 2;
                    }
                    break;
                case 4:
                    registerB = registerB ^ registerC;
                    instrPointer += 2;
                    break;
                case 5:
                    output.push(String((comboOperand + 8) % 8));
                    instrPointer += 2;
                    break;
                case 6:
                    registerB = Math.floor(registerA / (2 ** comboOperand));
                    instrPointer += 2;
                    break;
                case 7:
                    registerC = Math.floor(registerA / (2 ** comboOperand));
                    instrPointer += 2;
                    break;
            }
        }
        return output.join(",");
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}