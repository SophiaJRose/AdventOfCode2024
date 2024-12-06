export function partOne(input: string): string {
    return solution(input, false);
}

export function partTwo(input: string): string {
    return solution(input, true);
}

function solution(input: string, corrections: boolean): string {
    let rules: string[];
    let updates: string[];
    try {
        let sections: string[] = input.trim().split("\n\n");
        rules = sections[0].split("\n");
        updates = sections[1].split("\n");
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let count: number = 0;
        for (let update of updates) {
            let correct: boolean = true;
            let pages: string[] = update.split(",");
            for (let i = 0; i < pages.length-1 && (correct || corrections); i++) {
                for (let j = i+1; j < pages.length && (correct || corrections); j++) {
                    if (rules.includes(`${pages[j]}|${pages[i]}`)) {
                        correct = false;
                        if (corrections) {
                            let move: string = pages[j];
                            pages.splice(j,1);
                            pages.splice(i,0,move);
                        }
                    }
                }
            }
            if (correct != corrections) {
                count += Number(pages[Math.floor(pages.length / 2)])
            }
        }
        return String(count);
    } catch (err) {
        console.log(err);
        return "Error during solving."
    }
}