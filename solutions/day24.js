export function partOne(input) {
    let wires = new Map();
    let gates = [];
    try {
        let sections = input.trim().split("\n\n");
        let startingWires = sections[0].split("\n");
        for (let wire of startingWires) {
            let wireSections = wire.split(": ");
            let wireName = wireSections[0];
            let wireValue = Number(wireSections[1]);
            if (wireValue != 0 && wireValue != 1) {
                throw new Error(`Invalid value on wire ${wireName}: ${wireValue}`);
            }
            wires.set(wireName, wireValue == 1 ? true : false);
        }
        let gateStrs = sections[1].split("\n");
        for (let gateStr of gateStrs) {
            let gateSections = gateStr.split(" -> ");
            let gateInputs = gateSections[0].split(" ");
            let gateType = gateInputs[1];
            if (gateType != "AND" && gateType != "OR" && gateType != "XOR") {
                throw new Error(`Invalid gate type ${gateType} in gate ${gateStr}`);
            }
            let gate = { gateType: gateInputs[1], input1: gateInputs[0], input2: gateInputs[2], output: gateSections[1] };
            gates.push(gate);
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let queue = gates.slice();
        while (queue.length != 0) {
            let curGate = queue.shift();
            let input1 = wires.get(curGate.input1);
            let input2 = wires.get(curGate.input2);
            // If either of the input gates of the queue is not known, put back at end of queue and check next gate
            if (input1 === undefined || input2 === undefined) {
                queue.push(curGate);
                continue;
            }
            let gateType = curGate.gateType;
            let output;
            switch (gateType) {
                case "AND":
                    output = input1 && input2;
                    break;
                case "OR":
                    output = input1 || input2;
                    break;
                case "XOR":
                    output = input1 !== input2;
                    break;
                default:
                    // Invalid gate type will have been caught at parsing, but having a default guarantees output has a value;
                    throw new Error(`Invalid gate type ${gateType}`);
            }
            let outputWire = curGate.output;
            wires.set(outputWire, output);
        }
        console.log(wires);
        let zValues = [];
        wires.forEach((value, key) => {
            if (key.startsWith("z")) {
                let index = Number(key.slice(1));
                zValues[index] = value ? "1" : "0";
            }
        });
        console.log(zValues);
        let zNumber = parseInt(zValues.reverse().join(""), 2);
        return String(zNumber);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let wires = new Map();
    let gates = [];
    try {
        let sections = input.trim().split("\n\n");
        let startingWires = sections[0].split("\n");
        for (let wire of startingWires) {
            let wireSections = wire.split(": ");
            let wireName = wireSections[0];
            let wireValue = Number(wireSections[1]);
            if (wireValue != 0 && wireValue != 1) {
                throw new Error(`Invalid value on wire ${wireName}: ${wireValue}`);
            }
            wires.set(wireName, wireValue == 1 ? true : false);
        }
        let gateStrs = sections[1].split("\n");
        for (let gateStr of gateStrs) {
            let gateSections = gateStr.split(" -> ");
            let gateInputs = gateSections[0].split(" ");
            let gateType = gateInputs[1];
            if (gateType != "AND" && gateType != "OR" && gateType != "XOR") {
                throw new Error(`Invalid gate type ${gateType} in gate ${gateStr}`);
            }
            let gate = { gateType: gateInputs[1], input1: gateInputs[0], input2: gateInputs[2], output: gateSections[1] };
            gates.push(gate);
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        // Circuit is a 45-bit ripple carry adder, from which we can determine the following rules:
        // Rule 1: If output bit is z## and is not the final z bit (z45), gate must be XOR 
        // Rule 2: If output is not z## and inputs are not x## or y##, gate must not be XOR
        // Rule 3: A XOR gate with inputs bits x## and y## (other than x00 and y00) must be an input for some other XOR gate
        // Rule 4: All AND gates must be an input for an OR gate (unless inputs are x00 and y00)
        // Gates that break these rules have therefore been swapped
        // Note: This seems to be enough to find swapped gates, but swaps not detectable by these rules are theoretically possible, e.g. two AND gates obeying rule 4 being swapped
        // Thus, I cannot guarantee this code would produce the correct result for every officially-generated input
        let rule1 = gates.filter((x) => x.output.startsWith("z") && x.output != "z45" && x.gateType != "XOR");
        let rule1Outputs = rule1.map((x) => x.output);
        console.log(rule1);
        let rule2 = gates.filter((x) => !x.output.startsWith("z") && !x.input1.startsWith("x") && !x.input1.startsWith("y") && !x.input2.startsWith("x") && !x.input2.startsWith("y") && x.gateType == "XOR");
        let rule2Outputs = rule2.map((x) => x.output);
        console.log(rule2);
        let rule3 = gates.filter((x) => {
            let inputsAreXAndY = (x.input1.startsWith("x") || x.input2.startsWith("x")) && (x.input1.startsWith("y") || x.input2.startsWith("y"));
            let inputsNot00 = x.input1 != "x00" && x.input1 != "y00" && x.input2 != "x00" && x.input2 != "y00";
            let doesntOutputToXOR = !gates.some((y) => y.gateType == "XOR" && (y.input1 == x.output || y.input2 == x.output));
            return x.gateType == "XOR" && inputsAreXAndY && inputsNot00 && doesntOutputToXOR;
        });
        let rule3Outputs = rule3.map((x) => x.output);
        console.log(rule3);
        let rule4 = gates.filter((x) => {
            let inputsNot00 = x.input1 != "x00" && x.input1 != "y00" && x.input2 != "x00" && x.input2 != "y00";
            let doesntOutputToOR = !gates.some((y) => y.gateType == "OR" && (y.input1 == x.output || y.input2 == x.output));
            return x.gateType == "AND" && inputsNot00 && doesntOutputToOR;
        });
        let rule4Outputs = rule4.map((x) => x.output);
        console.log(rule4);
        // Rule 1 and 4 have some overlap, gates that break rule 1 by being AND instead of XOR likely break rule 4 as well
        // So only add outputs from rule 4 not already caught by rule 1
        let swappedOutputs = rule1Outputs.concat(rule2Outputs).concat(rule3Outputs);
        for (let output of rule4Outputs) {
            if (!swappedOutputs.includes(output)) {
                swappedOutputs.push(output);
            }
        }
        swappedOutputs.sort();
        return swappedOutputs.join(",");
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
