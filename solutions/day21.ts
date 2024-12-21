export function partOne(input: string, numDirectional: number): string {
    return solution(input, 1);
}

export function partTwo(input: string, numDirectional: number): string {
    return solution(input, 24);
}

const fastestRoute: Map<string, string[]> = new Map([
    ["AA", ["A"]],
    ["A^", ["<A"]],
    ["A>", ["vA"]],
    ["Av", ["<vA", "v<A"]],
    ["A<", ["v<<A", "<v<A"]],
    ["^A", [">A"]],
    ["^^", ["A"]],
    ["^>", ["v>A", ">vA"]],
    ["^v", ["vA"]],
    ["^<", ["v<A"]],
    [">A", ["^A"]],
    [">^", ["<^A", "^<A"]],
    [">>", ["A"]],
    [">v", ["<A"]],
    ["><", ["<<A"]],
    ["vA", [">^A", "^>A"]],
    ["v^", ["^A"]],
    ["v>", [">A"]],
    ["vv", ["A"]],
    ["v<", ["<A"]],
    ["<A", [">>^A", ">^>A"]],
    ["<^", [">^A"]],
    ["<>", [">>A"]],
    ["<v", [">A"]],
    ["<<", ["A"]],
]);

function solution(input: string, numDirectional: number): string {
    let codes: string[] = [];
    try {
        let lines: string[] = input.trim().split("\n");
        for (let line of lines) {
            let codeRegex: RegExp = /\d+A/;
            if (line.match(codeRegex) == null) {
                throw new Error("Code does not match format.");
            }
            codes.push(line);
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let total: number = 0;
        for (let code of codes) {
            let numericMoves: string = getNumericMovements(code);
            let transitionCosts: Map<string, number> = new Map();
            fastestRoute.forEach((value, key) => transitionCosts.set(key, value[0].length));
            for (let i = 0; i < numDirectional; i++) {
                transitionCosts = updateTransitionCosts(transitionCosts);
            }
            let curKey: string = "A";
            let totalCost: number = 0;
            for (let key of numericMoves) {
                let curTransition = curKey.concat(key);
                let curCost: number | undefined = transitionCosts.get(curTransition);
                if (curCost == undefined) {
                    throw new Error(`Transition is either invalid or missing from transitionCosts: ${curTransition}`)
                }
                totalCost += curCost;
                curKey = key;
            }
            let numericValue: number = Number(code.slice(0, code.length-1));
            total += numericValue * totalCost;
        }
        return String(total);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

function getNumericMovements(keyPresses: string): string {
    const keypad: Map<string, number[]> = new Map();
    keypad.set("7", [0,0]);
    keypad.set("8", [0,1]);
    keypad.set("9", [0,2]);
    keypad.set("4", [1,0]);
    keypad.set("5", [1,1]);
    keypad.set("6", [1,2]);
    keypad.set("1", [2,0]);
    keypad.set("2", [2,1]);
    keypad.set("3", [2,2]);
    keypad.set("0", [3,1]);
    keypad.set("A", [3,2]);
    let pos: number[] = <number[]>keypad.get("A");
    let movements: string = "";
    for (let key of keyPresses) {
        let desiredPos: number[] | undefined = keypad.get(key);
        if (desiredPos == undefined) {
            throw new Error(`Desired key does not exist on numeric keypad: ${key}`);
        }
        let vertMove: number = pos[0] - desiredPos[0];
        let horizMove: number = pos[1] - desiredPos[1];
        // Avoid going to blank space
        // If one position is on same row as blank space, and other is on same column, prioritise right, up, down, left. This order avoids both blank spaces.
        let blankSpace: number[] = [3,0];
        if ((pos[0] == blankSpace[0] && desiredPos[1] == blankSpace[1]) || (pos[1] == blankSpace[1] && desiredPos[0] == blankSpace[0])) {
            if (horizMove < 0) {
                for (let i = 0; i < Math.abs(horizMove); i++) {
                    movements = movements.concat(">");
                }
            }
            if (vertMove > 0) {
                for (let i = 0; i < vertMove; i++) {
                    movements = movements.concat("^");
                }
            }
            if (vertMove < 0) {
                for (let i = 0; i < Math.abs(vertMove); i++) {
                    movements = movements.concat("v");
                }
            }
            if (horizMove > 0) {
                for (let i = 0; i < horizMove; i++) {
                    movements = movements.concat("<");
                }
            }        
        } else {
            // Otherwise, prioritise left, then down, then right, then up, i.e. furthest keys from A first. This should optimise movement on the directional layers
            if (horizMove > 0) {
                for (let i = 0; i < horizMove; i++) {
                    movements = movements.concat("<");
                }
            }
            if (vertMove < 0) {
                for (let i = 0; i < Math.abs(vertMove); i++) {
                    movements = movements.concat("v");
                }
            }
            if (horizMove < 0) {
                for (let i = 0; i < Math.abs(horizMove); i++) {
                    movements = movements.concat(">");
                }
            }
            if (vertMove > 0) {
                for (let i = 0; i < vertMove; i++) {
                    movements = movements.concat("^");
                }
            }
        }
        pos = desiredPos;
        movements = movements.concat("A");
    }
    return movements;
}

function updateTransitionCosts(transitionCosts: Map<string, number>): Map<string,number> {
    let newCosts: Map<string, number> = new Map();
    fastestRoute.forEach((routes, transition) => {
        let curKey: string = "A";
        let minCost: number = Number.MAX_SAFE_INTEGER;
        for (let route of routes) {
            let cost: number = 0;
            for (let key of route) {
                let curTransition = curKey.concat(key);
                let curCost: number | undefined = transitionCosts.get(curTransition);
                if (curCost == undefined) {
                    throw new Error(`Transition is either invalid or missing from transitionCosts: ${curTransition}`)
                }
                cost += curCost;
                curKey = key;
            }
            if (cost < minCost) {
                minCost = cost;
            }
        }
        newCosts.set(transition, minCost);
    });
    return newCosts;
}