export function partOne(input: string): string {
    let locks: number[][] = [];
    let keys: number[][] = [];
    try {
        let items: string[] = input.trim().split("\n\n");
        for (let item of items) {
            let grid: string[][] = item.split("\n").map((x) => x.split(""));
            let isLock: boolean = grid[0].every((x) => x == "#");
            let heights: number[] = transpose(grid).map((x) => isLock ? x.lastIndexOf("#") : x.reverse().lastIndexOf("#"));
            if (isLock) {
                locks.push(heights);
            } else {
                keys.push(heights);
            }
        }
        console.log(locks);
        console.log(keys);
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let totalFits: number = 0;
        for (let lock of locks) {
            for (let key of keys) {
                let fits: boolean = true;
                for (let i = 0; i < lock.length; i++) {
                    if (lock[i] + key[i] > 5) {
                        fits = false;
                        break;
                    }
                }
                if (fits) {
                    totalFits++;
                }
            }
        }
        return String(totalFits);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

export function partTwo(input: string): string {
    return "There is no part 2";
}

function transpose(matrix: any[][]): any[][] {
    let newMatrix: any[][] = [];
    for (let j = 0; j < matrix[0].length; j++) {
        newMatrix[j] = Array(matrix.length);
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            newMatrix[j][i] = matrix[i][j];
        }
    }
    return newMatrix;
}