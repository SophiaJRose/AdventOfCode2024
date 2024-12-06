// 0 is up, 1 is right, 2 is down, 3 is left
const directions: number[][] = [[-1, 0], [0,1], [1, 0], [0,-1]]

function withinBounds(pos: number[], grid: any[][]) {
    return pos[0] >= 0 && pos[0] < grid.length && pos[1] >= 0 && pos[1] < grid[0].length;
}

function move(pos: number[], dir: number): number[] {
    return [pos[0] + directions[dir][0], pos[1] + directions[dir][1]];
}

export function partOne(input: string): string {
    let grid: string[][] = [];
    let guardPos: number[] = [0,0];
    let guardDir: number = 0;
    try {
        let lines: string[] = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            grid[i] = lines[i].split("");
            if (grid[i].includes("^")) {
                guardPos = [i, grid[i].indexOf("^")];
                guardDir = 0;
            } else if (grid[i].includes(">")) {
                guardPos = [i, grid[i].indexOf(">")];
                guardDir = 1;
            } else if (grid[i].includes("v")) {
                guardPos = [i, grid[i].indexOf("v")];
                guardDir = 2;
            } else if (grid[i].includes("<")) {
                guardPos = [i, grid[i].indexOf("<")];
                guardDir = 3;
            }
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        grid[guardPos[0]][guardPos[1]] = "X";
        let count: number = 1;
        let nextStep: number[] = move(guardPos, guardDir);
        while (withinBounds(nextStep, grid)) {
            if (grid[nextStep[0]][nextStep[1]] == "#") {
                guardDir = (guardDir + 1) % 4;
            } else {
                guardPos = nextStep;
            }
            if (grid[guardPos[0]][guardPos[1]] == ".") {
                grid[guardPos[0]][guardPos[1]] = "X";
                count++;
            }
            nextStep = move(guardPos, guardDir);
        }
        return String(count);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

export function partTwo(input: string): string {
    let grid: string[][] = [];
    let guardPos: number[] = [0,0];
    // 0 is up, 1 is right, 2 is down, 3 is left
    let guardDir: number = 0;
    const directions: number[][] = [[-1, 0], [0,1], [1, 0], [0,-1]]
    try {
        let lines: string[] = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            grid[i] = lines[i].split("");
            if (grid[i].includes("^")) {
                guardPos = [i, grid[i].indexOf("^")];
                guardDir = 0;
            } else if (grid[i].includes(">")) {
                guardPos = [i, grid[i].indexOf(">")];
                guardDir = 1;
            } else if (grid[i].includes("v")) {
                guardPos = [i, grid[i].indexOf("v")];
                guardDir = 2;
            } else if (grid[i].includes("<")) {
                guardPos = [i, grid[i].indexOf("<")];
                guardDir = 3;
            }
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let count: number = 0;
        let posChecked: number[][] = [];
        let nextStep: number[] = move(guardPos, guardDir);
        while (withinBounds(nextStep, grid)) {
            if (grid[nextStep[0]][nextStep[1]] == "#") {
                guardDir = (guardDir + 1) % 4;
            } else {
                // Check for loops
                if (!posChecked.some((obs) => obs[0] == nextStep[0] && obs[1] == nextStep[1])) {
                    grid[nextStep[0]][nextStep[1]] = "@";
                    let loopObs: number[][] = [[nextStep[0], nextStep[1], guardDir]];
                    let loopDir: number = (guardDir + 1) % 4;
                    let loopPos: number[] = guardPos;
                    while (true) {
                        let loopNext = move(loopPos, loopDir);
                        while (withinBounds(loopNext, grid) && grid[loopNext[0]][loopNext[1]] != "#" && grid[loopNext[0]][loopNext[1]] != "@") {
                            loopPos = loopNext
                            loopNext = move(loopPos, loopDir);
                        }
                        // If out of bounds, no loop
                        if (!withinBounds(loopNext, grid)) {
                            break;
                        }
                        // If obstruction has already been encountered from this direction, loop found, otherwise add to list, turn and continue
                        if (loopObs.some((obs) => obs[0] == loopNext[0] && obs[1] == loopNext[1] && obs[2] == loopDir)) {
                            // Loop of unseen obstructions found
                            count++;
                            break;
                        }
                        loopObs.push([loopNext[0], loopNext[1], loopDir]);
                        loopDir = (loopDir + 1) % 4;
                    }
                    grid[nextStep[0]][nextStep[1]] = ".";
                }
                guardPos = nextStep;
                posChecked.push(nextStep.slice());
            }
            nextStep = move(guardPos, guardDir);
        }
        return String(count);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}