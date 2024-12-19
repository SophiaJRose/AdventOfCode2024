export function partOne(input: string) {
    return solution(input, false);
}

export function partTwo(input: string) {
    return solution(input, true);
}

// Dynamic programming map
// Only needs design as key, because contents to towels array will always be the same
let matchesMap: Map<String, Number> = new Map();

function solution(input: string, allMatches: boolean): string {
    // Reset matches map to not retrieve answers from a different input
    matchesMap.clear()
    let towels: string[] = [];
    let designs: string[] = [];
    try {
        let sections: string[] = input.trim().split("\n\n");
        towels = sections[0].split(", ");
        designs = sections[1].split("\n");
    } catch (err) {
        console.log(err);
        return "Error parsing input"
    }
    try {
        let numDesigns: number = 0;
        for (let design of designs) {
            if (allMatches) {
                numDesigns += getNumMatches(design, towels);
            } else {
                if (getMatch(design, towels)) {
                    numDesigns++;
                }
            }
        }
        return String(numDesigns);
    } catch (err) {
        console.log(err);
        return "Error during solving"
    }
}

function getMatch(design: string, towels: string[]): boolean {
    let matchingTowels: string[] = towels.filter((x) => design.startsWith(x));
    for (let towel of matchingTowels) {
        if (towel == design) {
            return true;
        } else {
            let continueMatching: boolean = getMatch(design.slice(towel.length), towels);
            if (continueMatching) {
                return true;
            }
        }
    }
    // If no matching towels eventually lead to a full match, return false
    return false;
}

function getNumMatches(design: string, towels: string[]): number {
    // Check if answer already found
    let fromMap = matchesMap.get(design);
    if (fromMap != undefined) {
        return <number>fromMap;
    }
    let numMatches: number = 0;
    let matchingTowels: string[] = towels.filter((x) => design.startsWith(x));
    for (let towel of matchingTowels) {
        if (towel == design) {
            numMatches++;
        } else {
            let continueMatching: number = getNumMatches(design.slice(towel.length), towels);
            numMatches += continueMatching;
        }
    }
    matchesMap.set(design, numMatches);
    return numMatches;
}