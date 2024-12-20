export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
// Memoization table
// Only needs design as key, because contents to towels array will always be the same
let matchesMap = new Map();
function solution(input, allMatches) {
    // Reset matches map to not retrieve answers from a different input
    matchesMap.clear();
    let towels = [];
    let designs = [];
    try {
        let sections = input.trim().split("\n\n");
        towels = sections[0].split(", ");
        designs = sections[1].split("\n");
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let numDesigns = 0;
        for (let design of designs) {
            if (allMatches) {
                numDesigns += getNumMatches(design, towels);
            }
            else {
                if (getMatch(design, towels)) {
                    numDesigns++;
                }
            }
        }
        return String(numDesigns);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function getMatch(design, towels) {
    let matchingTowels = towels.filter((x) => design.startsWith(x));
    for (let towel of matchingTowels) {
        if (towel == design) {
            return true;
        }
        else {
            let continueMatching = getMatch(design.slice(towel.length), towels);
            if (continueMatching) {
                return true;
            }
        }
    }
    // If no matching towels eventually lead to a full match, return false
    return false;
}
function getNumMatches(design, towels) {
    // Check if answer already found
    let fromMap = matchesMap.get(design);
    if (fromMap != undefined) {
        return fromMap;
    }
    let numMatches = 0;
    let matchingTowels = towels.filter((x) => design.startsWith(x));
    for (let towel of matchingTowels) {
        if (towel == design) {
            numMatches++;
        }
        else {
            let continueMatching = getNumMatches(design.slice(towel.length), towels);
            numMatches += continueMatching;
        }
    }
    matchesMap.set(design, numMatches);
    return numMatches;
}
