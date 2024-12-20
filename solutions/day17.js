export function partOne(input) {
    let registerA = 0;
    let registerB = 0;
    let registerC = 0;
    let program = [];
    try {
        let parsedInput = parseInput(input);
        registerA = parsedInput.registerA;
        registerB = parsedInput.registerB;
        registerC = parsedInput.registerC;
        program = parsedInput.program;
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let output = runProgram(registerA, registerB, registerC, program);
        return output.join(",");
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let registerB = 0;
    let registerC = 0;
    let program = [];
    try {
        let parsedInput = parseInput(input);
        registerB = parsedInput.registerB;
        registerC = parsedInput.registerC;
        program = parsedInput.program;
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        /*
        Assumptions about input that appear to hold true, but that I cannot guarantee are true for all officially-generated inputs:
        Instructions include    a) a "bst" instruction of register A, i.e. "2,4",
                                b) a "cdv" instruction, i.e. "7,X", followed later by a "bxc" instruction, i.e. "4,X"
                            and c) an "adv" instruction with operand 8, i.e. "0,3"
        This means that each output digit is dependent on the current least-significant 3-bits of A (from the "bst"),
        and some (typically higher-significance) 3-bit sequence of A (from the "cdv" and "bxc"), and that A is then shifted right by 3-bits.
        Therefore, by working backwards through the desired output, we can find A by finding its most significant bits first, and shifting left by 3-bits (i.e. multiply by 8).
        For all values of register A that produce N-length output matching the final N digits of the program,
        multiplying by 8 produces an N+1-length output whose final N digits match the final N digits of the program.
        For some such value, adding some number between 0-7 will produce an N+1-length output matching the final N+1 digits of the program.
        Therefore, a value of A whose output fully matches the program can be found by repeating the above process, starting with values from 1-7
        (0 * 8 = 0, so checking 0 just adds a redundant step).
        */
        let matches = [0];
        let matchLength = 0;
        while (matchLength < program.length) {
            let newMatches = [];
            for (let match of matches) {
                for (let i = 0; i < 8; i++) {
                    let registerA = (match * 8) + i;
                    // No point in checking 0, if it matches final digit, it just adds redundant checks later
                    if (registerA == 0) {
                        continue;
                    }
                    let output = runProgram(registerA, registerB, registerC, program);
                    // Check output matches last N digits of program
                    let programEnd = program.slice(program.length - output.length);
                    let isMatching = true;
                    for (let i = 0; i < output.length; i++) {
                        if (Number(output[i]) != programEnd[i]) {
                            isMatching = false;
                            break;
                        }
                    }
                    if (isMatching) {
                        newMatches.push(registerA);
                    }
                }
            }
            matches = newMatches;
            matchLength++;
        }
        // By end of loop, we should have found at least 1 value whose output fully matches the program, return smallest one
        matches.sort();
        return String(matches[0]);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function parseInput(input) {
    let registerA = 0;
    let registerB = 0;
    let registerC = 0;
    let program = [];
    let lines = input.trim().split("\n");
    const registerARegex = /Register A\: (\d+)/;
    const registerBRegex = /Register B\: (\d+)/;
    const registerCRegex = /Register C\: (\d+)/;
    const programRegex = /Program\: ((?:\d+\,)*\d+)/;
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
    return { registerA: registerA, registerB: registerB, registerC: registerC, program: program };
}
function runProgram(registerA, registerB, registerC, program) {
    let instrPointer = 0;
    let output = [];
    while (instrPointer < program.length) {
        let instruction = program[instrPointer];
        let operand = program[instrPointer + 1];
        let comboOperand = operand;
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
                registerB = Number(BigInt(registerB) ^ BigInt(operand));
                instrPointer += 2;
                break;
            case 2:
                registerB = (comboOperand + 8) % 8;
                instrPointer += 2;
                break;
            case 3:
                if (registerA != 0) {
                    instrPointer = operand;
                }
                else {
                    instrPointer += 2;
                }
                break;
            case 4:
                registerB = Number(BigInt(registerB) ^ BigInt(registerC));
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
    return output;
}
