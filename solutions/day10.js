export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
function solution(input, ratings) {
    let grid = [];
    let trailheads = [];
    try {
        let lines = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            let row = lines[i].split("").map(Number);
            if (row.some((x) => Number.isNaN(x))) {
                throw new Error("Input contains NaNs");
            }
            for (let j = 0; j < row.length; j++) {
                if (row[j] == 0) {
                    trailheads.push([i, j]);
                }
            }
            grid.push(row);
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let totalScore = 0;
        let totalRatings = 0;
        for (let trailhead of trailheads) {
            let queue = [trailhead];
            let nines = [];
            while (queue.length != 0) {
                let curSpace = queue.shift();
                let i = curSpace[0];
                let j = curSpace[1];
                if (grid[i][j] == 9) {
                    totalRatings++;
                    if (!nines.some((x) => x[0] == i && x[1] == j)) {
                        nines.push([i, j]);
                        continue;
                    }
                }
                if (i > 0 && grid[i - 1][j] == grid[i][j] + 1) {
                    queue.push([i - 1, j]);
                }
                if (i < grid.length - 1 && grid[i + 1][j] == grid[i][j] + 1) {
                    queue.push([i + 1, j]);
                }
                if (j > 0 && grid[i][j - 1] == grid[i][j] + 1) {
                    queue.push([i, j - 1]);
                }
                if (j < grid[i].length - 1 && grid[i][j + 1] == grid[i][j] + 1) {
                    queue.push([i, j + 1]);
                }
            }
            totalScore += nines.length;
        }
        return ratings ? String(totalRatings) : String(totalScore);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
