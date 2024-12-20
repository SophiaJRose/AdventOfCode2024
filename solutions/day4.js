export function partOne(input) {
    let grid = [];
    let lines;
    try {
        lines = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            grid[i] = lines[i].split("");
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let count = 0;
        const word = "XMAS";
        const dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == "X") {
                    for (let dir of dirs) {
                        let wordIndex = 1;
                        let newPos = [i, j];
                        while (wordIndex < 4) {
                            newPos = [newPos[0] + dir[0], newPos[1] + dir[1]];
                            if (newPos[0] < 0 || newPos[0] >= grid.length || newPos[1] < 0 || newPos[1] >= grid[newPos[0]].length) {
                                break;
                            }
                            if (grid[newPos[0]][newPos[1]] == word.charAt(wordIndex)) {
                                wordIndex++;
                            }
                            else {
                                break;
                            }
                        }
                        if (wordIndex == 4) {
                            count++;
                        }
                    }
                }
            }
        }
        return String(count);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let grid = [];
    let lines;
    try {
        lines = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            grid[i] = lines[i].split("");
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let count = 0;
        // Finding X-MASes by finding A, which cannot be at edge of grid, so iterate for 1 to grid.length-2
        for (let i = 1; i < grid.length - 1; i++) {
            for (let j = 1; j < grid[i].length - 1; j++) {
                if (grid[i][j] == "A") {
                    let diagonals = [grid[i - 1][j - 1], grid[i - 1][j + 1], grid[i + 1][j - 1], grid[i + 1][j + 1]].toString();
                    if (diagonals == "M,M,S,S" || diagonals == "S,M,S,M" || diagonals == "S,S,M,M" || diagonals == "M,S,M,S") {
                        count++;
                        console.log(`X-MAS at ${i}, ${j}`);
                    }
                }
            }
        }
        return String(count);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
