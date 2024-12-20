class Robot {
    constructor(position) {
        this.tile = "@";
        this.position = position == null ? [0, 0] : position;
    }
    moveUp(grid, boxes) {
        let upPos = [this.position[0] - 1, this.position[1]];
        let tile = grid[upPos[0]][upPos[1]];
        if (tile == "#") {
            return false;
        }
        else if (tile == "O" || tile == "[" || tile == "]") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == (tile == "]" ? upPos[1] - 1 : upPos[1]));
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveUp(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[upPos[0]][upPos[1]] = this.tile;
        this.position = upPos;
        return true;
    }
    moveRight(grid, boxes) {
        let rightPos = [this.position[0], this.position[1] + 1];
        let tile = grid[rightPos[0]][rightPos[1]];
        if (tile == "#") {
            return false;
        }
        else if (tile == "O" || tile == "[") {
            let box = boxes.find((x) => x.position[0] == rightPos[0] && x.position[1] == rightPos[1]);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveRight(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[rightPos[0]][rightPos[1]] = this.tile;
        this.position = rightPos;
        return true;
    }
    moveDown(grid, boxes) {
        let downPos = [this.position[0] + 1, this.position[1]];
        let tile = grid[downPos[0]][downPos[1]];
        if (tile == "#") {
            return false;
        }
        else if (tile == "O" || tile == "[" || tile == "]") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == (tile == "]" ? downPos[1] - 1 : downPos[1]));
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveDown(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[downPos[0]][downPos[1]] = this.tile;
        this.position = downPos;
        return true;
    }
    moveLeft(grid, boxes) {
        let leftPos = [this.position[0], this.position[1] - 1];
        let tile = grid[leftPos[0]][leftPos[1]];
        if (tile == "#") {
            return false;
        }
        else if (tile == "O" || tile == "]") {
            let box = boxes.find((x) => x.position[0] == leftPos[0] && x.position[1] == (tile == "]" ? leftPos[1] - 1 : leftPos[1]));
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveLeft(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[leftPos[0]][leftPos[1]] = this.tile;
        this.position = leftPos;
        return true;
    }
}
class Box extends Robot {
    constructor(position) {
        super(position);
        this.tile = "O";
    }
    getGPS() {
        return this.position[0] * 100 + this.position[1];
    }
}
class WideBox extends Box {
    // WideBox's position is the position of the left half, "["
    constructor(position) {
        super(position);
    }
    checkUp(grid, boxes) {
        let upPos = [this.position[0] - 1, this.position[1]];
        let leftTile = grid[upPos[0]][upPos[1]];
        let rightTile = grid[upPos[0]][upPos[1] + 1];
        if (leftTile == "#" || rightTile == "#") {
            return false;
        }
        else if (leftTile == "[" && rightTile == "]") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1]);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkUp(grid, boxes);
        }
        else if (leftTile == "]" && rightTile == "[") {
            let box1 = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] - 1);
            let box2 = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] + 1);
            if (box1 == undefined || box2 == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let checkBox1 = box1.checkUp(grid, boxes);
            let checkBox2 = box2.checkUp(grid, boxes);
            return checkBox1 && checkBox2;
        }
        else if (leftTile == "]" && rightTile == ".") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] - 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkUp(grid, boxes);
        }
        else if (rightTile == "[" && leftTile == ".") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] + 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkUp(grid, boxes);
        }
        else {
            return true;
        }
    }
    checkDown(grid, boxes) {
        let downPos = [this.position[0] + 1, this.position[1]];
        let leftTile = grid[downPos[0]][downPos[1]];
        let rightTile = grid[downPos[0]][downPos[1] + 1];
        if (leftTile == "#" || rightTile == "#") {
            return false;
        }
        else if (leftTile == "[" && rightTile == "]") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1]);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkDown(grid, boxes);
        }
        else if (leftTile == "]" && rightTile == "[") {
            let box1 = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] - 1);
            let box2 = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] + 1);
            if (box1 == undefined || box2 == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let checkBox1 = box1.checkDown(grid, boxes);
            let checkBox2 = box2.checkDown(grid, boxes);
            return checkBox1 && checkBox2;
        }
        else if (leftTile == "]" && rightTile == ".") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] - 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkDown(grid, boxes);
        }
        else if (rightTile == "[" && leftTile == ".") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] + 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            return box.checkDown(grid, boxes);
        }
        else {
            return true;
        }
    }
    moveUp(grid, boxes) {
        let upPos = [this.position[0] - 1, this.position[1]];
        let leftTile = grid[upPos[0]][upPos[1]];
        let rightTile = grid[upPos[0]][upPos[1] + 1];
        if (leftTile == "#" || rightTile == "#") {
            return false;
        }
        else if (leftTile == "[" && rightTile == "]") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1]);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveUp(grid, boxes);
            if (pushBox) {
                grid[this.position[0]][this.position[1]] = ".";
                grid[this.position[0]][this.position[1] + 1] = ".";
                grid[upPos[0]][upPos[1]] = "[";
                grid[upPos[0]][upPos[1] + 1] = "]";
                this.position = upPos;
                return true;
            }
            else {
                return false;
            }
        }
        else if (leftTile == "]" && rightTile == "[") {
            let box1 = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] - 1);
            let box2 = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] + 1);
            if (box1 == undefined || box2 == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            // Check if both boxes can be moved, and only move if they can
            let checkBox1 = box1.checkUp(grid, boxes);
            let checkBox2 = box2.checkUp(grid, boxes);
            if (checkBox1 && checkBox2) {
                box1.moveUp(grid, boxes);
                box2.moveUp(grid, boxes);
                grid[this.position[0]][this.position[1]] = ".";
                grid[this.position[0]][this.position[1] + 1] = ".";
                grid[upPos[0]][upPos[1]] = "[";
                grid[upPos[0]][upPos[1] + 1] = "]";
                this.position = upPos;
                return true;
            }
            else {
                return false;
            }
        }
        else if (leftTile == "]" && rightTile == ".") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] - 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveUp(grid, boxes);
            if (pushBox) {
                grid[this.position[0]][this.position[1]] = ".";
                grid[this.position[0]][this.position[1] + 1] = ".";
                grid[upPos[0]][upPos[1]] = "[";
                grid[upPos[0]][upPos[1] + 1] = "]";
                this.position = upPos;
                return true;
            }
            else {
                return false;
            }
        }
        else if (rightTile == "[" && leftTile == ".") {
            let box = boxes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1] + 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveUp(grid, boxes);
            if (pushBox) {
                grid[this.position[0]][this.position[1]] = ".";
                grid[this.position[0]][this.position[1] + 1] = ".";
                grid[upPos[0]][upPos[1]] = "[";
                grid[upPos[0]][upPos[1] + 1] = "]";
                this.position = upPos;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            grid[this.position[0]][this.position[1]] = ".";
            grid[this.position[0]][this.position[1] + 1] = ".";
            grid[upPos[0]][upPos[1]] = "[";
            grid[upPos[0]][upPos[1] + 1] = "]";
            this.position = upPos;
            return true;
        }
    }
    moveRight(grid, boxes) {
        let rightPos = [this.position[0], this.position[1] + 1];
        let tile = grid[rightPos[0]][rightPos[1] + 1];
        if (tile == "#") {
            return false;
        }
        else if (tile == "[") {
            let box = boxes.find((x) => x.position[0] == rightPos[0] && x.position[1] == rightPos[1] + 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveRight(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[rightPos[0]][rightPos[1]] = "[";
        grid[rightPos[0]][rightPos[1] + 1] = "]";
        this.position = rightPos;
        return true;
    }
    moveDown(grid, boxes) {
        let downPos = [this.position[0] + 1, this.position[1]];
        let leftTile = grid[downPos[0]][downPos[1]];
        let rightTile = grid[downPos[0]][downPos[1] + 1];
        if (leftTile == "#" || rightTile == "#") {
            return false;
        }
        else if (leftTile == "[" && rightTile == "]") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1]);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveDown(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        else if (leftTile == "]" && rightTile == "[") {
            let box1 = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] - 1);
            let box2 = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] + 1);
            if (box1 == undefined || box2 == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            // Check if both boxes can be moved, and only move if they can
            let checkBox1 = box1.checkDown(grid, boxes);
            let checkBox2 = box2.checkDown(grid, boxes);
            if (checkBox1 && checkBox2) {
                box1.moveDown(grid, boxes);
                box2.moveDown(grid, boxes);
            }
            else {
                return false;
            }
        }
        else if (leftTile == "]" && rightTile == ".") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] - 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveDown(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        else if (rightTile == "[" && leftTile == ".") {
            let box = boxes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1] + 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveDown(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1]] = ".";
        grid[this.position[0]][this.position[1] + 1] = ".";
        grid[downPos[0]][downPos[1]] = "[";
        grid[downPos[0]][downPos[1] + 1] = "]";
        this.position = downPos;
        return true;
    }
    moveLeft(grid, boxes) {
        let leftPos = [this.position[0], this.position[1] - 1];
        let tile = grid[leftPos[0]][leftPos[1]];
        if (tile == "#") {
            return false;
        }
        else if (tile == "]") {
            let box = boxes.find((x) => x.position[0] == leftPos[0] && x.position[1] == leftPos[1] - 1);
            if (box == undefined) {
                throw new Error("Box co-ords desynced with grid");
            }
            let pushBox = box.moveLeft(grid, boxes);
            if (!pushBox) {
                return false;
            }
        }
        grid[this.position[0]][this.position[1] + 1] = ".";
        grid[this.position[0]][this.position[1]] = "]";
        grid[leftPos[0]][leftPos[1]] = "[";
        this.position = leftPos;
        return true;
    }
}
export function partOne(input) {
    return solution(input, false);
}
export function partTwo(input) {
    return solution(input, true);
}
export function solution(input, wide) {
    const widen = new Map();
    widen.set("#", "##");
    widen.set(".", "..");
    widen.set("O", "[]");
    widen.set("@", "@.");
    let grid = [];
    let moves = "";
    let boxes = [];
    let robot = new Robot(null);
    try {
        let sections = input.trim().split("\n\n");
        let gridLines = sections[0].split("\n");
        for (let i = 0; i < gridLines.length; i++) {
            let row = gridLines[i].split("");
            if (wide) {
                let wideRow = "";
                for (let j = 0; j < row.length; j++) {
                    if (row[j] == "@") {
                        robot = new Robot([i, wideRow.length]);
                    }
                    else if (row[j] == "O") {
                        let box = new WideBox([i, wideRow.length]);
                        boxes.push(box);
                    }
                    wideRow += widen.get(row[j]);
                }
                grid.push(wideRow.split(""));
            }
            else {
                for (let j = 0; j < row.length; j++) {
                    if (row[j] == "@") {
                        robot = new Robot([i, j]);
                    }
                    else if (row[j] == "O") {
                        let box = new Box([i, j]);
                        boxes.push(box);
                    }
                }
                grid.push(row);
            }
        }
        moves = sections[1].split("\n").join("\n");
        if (robot.position[0] == 0 && robot.position[1] == 0) {
            throw new Error("Input did not contain robot");
        }
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        for (let i = 0; i < moves.length; i++) {
            let move = moves.charAt(i);
            switch (move) {
                case "^":
                    robot.moveUp(grid, boxes);
                    break;
                case ">":
                    robot.moveRight(grid, boxes);
                    break;
                case "v":
                    robot.moveDown(grid, boxes);
                    break;
                case "<":
                    robot.moveLeft(grid, boxes);
                    break;
            }
        }
        let sumGPS = 0;
        for (let box of boxes) {
            sumGPS += box.getGPS();
        }
        return String(sumGPS);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
