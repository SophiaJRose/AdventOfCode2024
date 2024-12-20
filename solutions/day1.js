export function partOne(input) {
    let left = [];
    let right = [];
    try {
        let lines = input.trim().split("\n");
        for (let line of lines) {
            let numbers = line.split("   ");
            let l = Number(numbers[0]);
            let r = Number(numbers[1]);
            if (Number.isNaN(l) || Number.isNaN(r)) {
                throw new Error("Input contains NaNs");
            }
            left.push(l);
            right.push(r);
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        left.sort();
        right.sort();
        let totalDistance = 0;
        for (let i in left) {
            totalDistance += Math.abs(left[i] - right[i]);
        }
        if (Number.isNaN(totalDistance)) {
            throw new Error("Result is NaN");
        }
        return String(totalDistance);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let left = [];
    let rightAppearances = [];
    try {
        let lines = input.trim().split("\n");
        for (let line of lines) {
            let numbers = line.split("   ");
            let l = Number(numbers[0]);
            let r = Number(numbers[1]);
            if (Number.isNaN(l) || Number.isNaN(r)) {
                throw new Error("Input contains NaNs");
            }
            left.push(l);
            if (rightAppearances[r] == undefined) {
                rightAppearances[r] = 1;
            }
            else {
                rightAppearances[r] += 1;
            }
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let similarScore = 0;
        for (let l of left) {
            if (rightAppearances[l] != undefined) {
                similarScore += l * rightAppearances[l];
            }
        }
        if (Number.isNaN(similarScore)) {
            throw new Error("Result is NaN");
        }
        return String(similarScore);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
