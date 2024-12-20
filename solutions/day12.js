class Region {
    constructor(plant, plots) {
        if (plots != undefined) {
            this.plots = plots;
        }
        else {
            this.plots = [];
        }
        if (plant != undefined) {
            this.plant = plant;
        }
        else {
            this.plant = "";
        }
    }
    contains(position) {
        return this.plots.some((x) => x[0] == position[0] && x[1] == position[1]);
    }
    area() {
        return this.plots.length;
    }
    perimeter(height, width) {
        let perimeter = [];
        for (let plot of this.plots) {
            if (plot[0] == 0 || !this.contains([plot[0] - 1, plot[1]])) {
                perimeter.push([plot[0] - 0.1, plot[1]]);
            }
            if (plot[0] == height - 1 || !this.contains([plot[0] + 1, plot[1]])) {
                perimeter.push([plot[0] + 0.1, plot[1]]);
            }
            if (plot[1] == 0 || !this.contains([plot[0], plot[1] - 1])) {
                perimeter.push([plot[0], plot[1] - 0.1]);
            }
            if (plot[1] == width - 1 || !this.contains([plot[0], plot[1] + 1])) {
                perimeter.push([plot[0], plot[1] + 0.1]);
            }
        }
        return perimeter;
    }
    sides(height, width) {
        let perimeter = this.perimeter(height, width);
        // side is 4 numbers, iStart, iEnd, jStart, jEnd, if side is horizontal, iStart == iEnd, if side is vertical, jStart == jEnd
        let sides = [];
        for (let fence of perimeter) {
            let connectedSide = sides.find((x) => (fence[0] == x[0] && fence[0] == x[1] && (fence[1] == x[2] - 1 || fence[1] == x[3] + 1)) || ((fence[0] == x[0] - 1 || fence[0] == x[1] + 1) && fence[1] == x[2] && fence[1] == x[3]));
            if (connectedSide == undefined) {
                sides.push([fence[0], fence[0], fence[1], fence[1]]);
            }
            else {
                if (fence[1] == connectedSide[2] - 1) {
                    connectedSide[2] = fence[1];
                }
                else if (fence[1] == connectedSide[3] + 1) {
                    connectedSide[3] = fence[1];
                }
                else if (fence[0] == connectedSide[0] - 1) {
                    connectedSide[0] = fence[0];
                }
                else if (fence[0] == connectedSide[1] + 1) {
                    connectedSide[1] = fence[0];
                }
            }
        }
        return sides;
    }
}
function findAllConnected(grid, i, j) {
    let value = grid[i][j];
    let connected = [];
    let queue = [[i, j]];
    let checked = [];
    while (queue.length != 0) {
        let pos = queue.shift();
        if (checked.some((x) => x[0] == pos[0] && x[1] == pos[1])) {
            continue;
        }
        checked.push(pos);
        if (grid[pos[0]][pos[1]] == value) {
            connected.push(pos);
            if (pos[0] > 0) {
                queue.push([pos[0] - 1, pos[1]]);
            }
            if (pos[0] < grid.length - 1) {
                queue.push([pos[0] + 1, pos[1]]);
            }
            if (pos[1] > 0) {
                queue.push([pos[0], pos[1] - 1]);
            }
            if (pos[1] < grid.length - 1) {
                queue.push([pos[0], pos[1] + 1]);
            }
        }
    }
    return connected;
}
export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
export function solution(input, sides) {
    let grid = [];
    try {
        let lines = input.trim().split("\n");
        for (let line of lines) {
            grid.push(line.split(""));
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        // Map out all regions
        let regions = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                let plot = grid[i][j];
                if (regions.some((x) => x.contains([i, j]))) {
                    continue;
                }
                let regionPlots = findAllConnected(grid, i, j);
                regions.push(new Region(plot, regionPlots));
            }
        }
        let cost = 0;
        let h = grid.length;
        let w = grid[0].length;
        for (let region of regions) {
            cost += region.area() * (sides ? region.sides(h, w).length : region.perimeter(h, w).length);
        }
        return String(cost);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}