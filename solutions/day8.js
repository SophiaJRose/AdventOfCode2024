function withinBounds(pos, h, w) {
    return pos[0] >= 0 && pos[0] < h && pos[1] >= 0 && pos[1] < w;
}
export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
function solution(input, repeat) {
    let grid = [];
    let antennas = new Map();
    try {
        let lines = input.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            let row = lines[i].split("");
            for (let j = 0; j < row.length; j++) {
                let tile = row[j];
                if (tile != ".") {
                    let posList = antennas.get(tile);
                    if (posList == undefined) {
                        posList = [];
                    }
                    posList.push([i, j]);
                    antennas.set(tile, posList);
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
        let antinodeList = [];
        antennas.forEach((value, key) => {
            for (let i = 0; i < value.length - 1; i++) {
                for (let j = i + 1; j < value.length; j++) {
                    let antenna1 = value[i];
                    let antenna2 = value[j];
                    let dist = [antenna2[0] - antenna1[0], antenna2[1] - antenna1[1]];
                    if (!repeat) {
                        let antinode1 = [antenna1[0] - dist[0], antenna1[1] - dist[1]];
                        if (!antinodeList.some((x) => x[0] == antinode1[0] && x[1] == antinode1[1]) && withinBounds(antinode1, grid.length, grid[0].length)) {
                            antinodeList.push(antinode1);
                        }
                        let antinode2 = [antenna2[0] + dist[0], antenna2[1] + dist[1]];
                        if (!antinodeList.some((x) => x[0] == antinode2[0] && x[1] == antinode2[1]) && withinBounds(antinode2, grid.length, grid[0].length)) {
                            antinodeList.push(antinode2);
                        }
                    }
                    else {
                        let antinode1 = antenna1;
                        while (withinBounds(antinode1, grid.length, grid[0].length)) {
                            if (!antinodeList.some((x) => x[0] == antinode1[0] && x[1] == antinode1[1])) {
                                antinodeList.push(antinode1);
                            }
                            antinode1 = [antinode1[0] - dist[0], antinode1[1] - dist[1]];
                        }
                        let antinode2 = antenna2;
                        while (withinBounds(antinode2, grid.length, grid[0].length)) {
                            if (!antinodeList.some((x) => x[0] == antinode2[0] && x[1] == antinode2[1])) {
                                antinodeList.push(antinode2);
                            }
                            antinode2 = [antinode2[0] + dist[0], antinode2[1] + dist[1]];
                        }
                    }
                }
            }
        });
        return String(antinodeList.length);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
