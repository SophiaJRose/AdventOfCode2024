class Robot {
    position: number[];
    velocity: number[];

    constructor(position: number[], velocity: number[]) {
        this.position = position == null ? [0,0] : position;
        this.velocity = velocity == null ? [0,0]: velocity;
    }

    move(height: number, width: number) {
        this.position = [(this.position[0] + this.velocity[0] + height) % height, (this.position[1] + this.velocity[1] + width) % width];
    }
}

export function partOne(input: string): string {
    let robots: Robot[] = [];
    try {
        let lines: string[] = input.trim().split("\n");
        const robotRegex = /p\=(\-?\d+),(\-?\d+) v\=(\-?\d+),(\-?\d+)/;
        for (let line of lines) {
            let robotMatches = line.match(robotRegex);
            if (robotMatches == null) {
                throw new Error(`Could not parse line: ${line}`);
            }
            // Values are given as x,y where x is horizontal and y is vertical, switch to i, j where i is vertical and j is horizontal
            let robot: Robot = new Robot([Number(robotMatches[2]), Number(robotMatches[1])], [Number(robotMatches[4]), Number(robotMatches[3])]);
            robots.push(robot);
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        const height = 103;
        const width = 101;
        for (let i = 0; i < 100; i++) {
            for (let robot of robots) {
                robot.move(height, width);
            }
        }
        const middleRow = Math.floor(height / 2);
        const middleCol = Math.floor(width / 2);
        let q1: number = robots.filter((x) => x.position[0] < middleRow && x.position[1] < middleCol).length;
        let q2: number = robots.filter((x) => x.position[0] < middleRow && x.position[1] > middleCol).length;
        let q3: number = robots.filter((x) => x.position[0] > middleRow && x.position[1] < middleCol).length;
        let q4: number = robots.filter((x) => x.position[0] > middleRow && x.position[1] > middleCol).length;
        let safetyFactor: number = q1 * q2 * q3 * q4
        return String(safetyFactor);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

export function partTwo(input: string): string {
    let robots: Robot[] = [];
    try {
        let lines: string[] = input.trim().split("\n");
        const robotRegex = /p\=(\-?\d+),(\-?\d+) v\=(\-?\d+),(\-?\d+)/;
        for (let line of lines) {
            let robotMatches = line.match(robotRegex);
            if (robotMatches == null) {
                throw new Error(`Could not parse line: ${line}`);
            }
            // Values are given as x,y where x is horizontal and y is vertical, switch to i, j where i is vertical and j is horizontal
            let robot: Robot = new Robot([Number(robotMatches[2]), Number(robotMatches[1])], [Number(robotMatches[4]), Number(robotMatches[3])]);
            robots.push(robot);
        }
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        const height = 103;
        const width = 101;
        let grid: string = "";
        let seconds: number = 0;
        // Loop criteria determined by guessing what the picture is supposed to look like, and manually checking grid when potential match found
        while (!grid.includes("1111111111111111")) {
            for (let robot of robots) {
                robot.move(height, width);
            }
            seconds++;
            grid = printGrid(height, width, robots);
        }
        return String(seconds);
    } catch (err) {
        console.log(err);
        return "Error during solving";
    }
}

function printGrid(height: number, width: number, robots: Robot[]): string {
    let grid = "";
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let robotsInPos = robots.filter((x) => x.position[0] == i && x.position[1] == j).length;
            grid += robotsInPos == 0 ? "." : String(robotsInPos);
        }
        grid += "\n";
    }
    return grid;
}