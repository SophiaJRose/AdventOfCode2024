export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
function solution(input, corrections) {
    let rules;
    let updates;
    try {
        let sections = input.trim().split("\n\n");
        rules = sections[0].split("\n");
        updates = sections[1].split("\n");
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let count = 0;
        for (let update of updates) {
            let correct = true;
            let pages = update.split(",");
            for (let i = 0; i < pages.length - 1 && (correct || corrections); i++) {
                for (let j = i + 1; j < pages.length && (correct || corrections); j++) {
                    if (rules.includes(`${pages[j]}|${pages[i]}`)) {
                        correct = false;
                        if (corrections) {
                            let move = pages[j];
                            pages.splice(j, 1);
                            pages.splice(i, 0, move);
                        }
                    }
                }
            }
            if (correct != corrections) {
                count += Number(pages[Math.floor(pages.length / 2)]);
            }
        }
        return String(count);
    }
    catch (err) {
        console.log(err);
        return "Error during solving.";
    }
}
