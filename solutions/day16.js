var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["East"] = 1] = "East";
    Direction[Direction["South"] = 2] = "South";
    Direction[Direction["West"] = 3] = "West";
})(Direction || (Direction = {}));
function turnRight(dir) {
    return (dir + 1) % 4;
}
function turnLeft(dir) {
    return (dir + 3) % 4;
}
function getForwardPos(pos, dir) {
    switch (dir) {
        case Direction.North:
            return [pos[0] - 1, pos[1]];
        case Direction.East:
            return [pos[0], pos[1] + 1];
        case Direction.South:
            return [pos[0] + 1, pos[1]];
        case Direction.West:
            return [pos[0], pos[1] - 1];
    }
}
export function partOne(input) {
    let grid = [];
    let start = [];
    let end = [];
    try {
        let parsedInput = parseInput(input);
        grid = parsedInput.grid;
        start = parsedInput.start;
        end = parsedInput.end;
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph = buildGraph(grid, start);
        dijkstra(graph);
        let endNodes = graph.nodes.filter((x) => x.position[0] == end[0] && x.position[1] == end[1]);
        if (endNodes.length == 0) {
            throw new Error("End not reachable from start");
        }
        let endDistances = endNodes.map((x) => x.distance);
        endDistances.sort();
        return String(endDistances[0]);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let grid = [];
    let start = [];
    let end = [];
    try {
        let parsedInput = parseInput(input);
        grid = parsedInput.grid;
        start = parsedInput.start;
        end = parsedInput.end;
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph = buildGraph(grid, start);
        dijkstra(graph);
        let endNodes = graph.nodes.filter((x) => x.position[0] == end[0] && x.position[1] == end[1]);
        if (endNodes.length == 0) {
            throw new Error("End not reachable from start");
        }
        endNodes.sort((a, b) => a.distance - b.distance);
        let bestPaths = endNodes[0].paths;
        let bestPathTiles = [];
        for (let path of bestPaths) {
            for (let tile of path) {
                if (!bestPathTiles.some((x) => x[0] == tile[0] && x[1] == tile[1])) {
                    bestPathTiles.push(tile);
                }
            }
        }
        return String(bestPathTiles.length);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function parseInput(input) {
    let grid = [];
    let start = [];
    let end = [];
    let lines = input.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let row = lines[i].split("");
        for (let j = 0; j < lines[i].length; j++) {
            if (row[j] == "S") {
                start = [i, j];
            }
            if (row[j] == "E") {
                end = [i, j];
            }
        }
        grid.push(row);
    }
    if (start.length == 0) {
        throw new Error("No start space in input.");
    }
    if (end.length == 0) {
        throw new Error("No end space in input.");
    }
    return { grid: grid, start: start, end: end };
}
function buildGraph(grid, start) {
    // Build graph
    let graph = { nodes: [] };
    let startNode = { position: start, direction: Direction.East, forward: undefined, turnLeft: undefined, turnRight: undefined, distance: 0, paths: [[[start[0], start[1], Direction.East]]] };
    graph.nodes.push(startNode);
    let queue = [startNode];
    while (queue.length != 0) {
        let curNode = queue.shift();
        if (curNode.forward === undefined) {
            let forwardPos = getForwardPos(curNode.position, curNode.direction);
            let existingNode = graph.nodes.find((x) => x.position[0] == forwardPos[0] && x.position[1] == forwardPos[1] && x.direction == curNode.direction);
            if (existingNode !== undefined) {
                curNode.forward = existingNode;
            }
            else {
                let forward = grid[forwardPos[0]][forwardPos[1]];
                if (forward == "." || forward == "E") {
                    let forwardNode = { position: forwardPos, direction: curNode.direction, forward: undefined, turnLeft: undefined, turnRight: undefined, distance: Number.POSITIVE_INFINITY, paths: [] };
                    curNode.forward = forwardNode;
                    graph.nodes.push(forwardNode);
                    queue.push(forwardNode);
                }
                else {
                    curNode.forward = null;
                }
            }
        }
        if (curNode.turnLeft === undefined) {
            let leftDir = turnLeft(curNode.direction);
            let existingNode = graph.nodes.find((x) => x.position[0] == curNode.position[0] && x.position[1] == curNode.position[1] && x.direction == leftDir);
            if (existingNode !== undefined) {
                curNode.turnLeft = existingNode;
            }
            else {
                let leftNode = { position: curNode.position, direction: leftDir, forward: undefined, turnLeft: undefined, turnRight: undefined, distance: Number.POSITIVE_INFINITY, paths: [] };
                curNode.turnLeft = leftNode;
                graph.nodes.push(leftNode);
                queue.push(leftNode);
            }
        }
        if (curNode.turnRight === undefined) {
            let rightDir = turnRight(curNode.direction);
            let existingNode = graph.nodes.find((x) => x.position[0] == curNode.position[0] && x.position[1] == curNode.position[1] && x.direction == rightDir);
            if (existingNode !== undefined) {
                curNode.turnRight = existingNode;
            }
            else {
                let rightNode = { position: curNode.position, direction: rightDir, forward: undefined, turnLeft: undefined, turnRight: undefined, distance: Number.POSITIVE_INFINITY, paths: [] };
                curNode.turnRight = rightNode;
                graph.nodes.push(rightNode);
                queue.push(rightNode);
            }
        }
    }
    return graph;
}
function dijkstra(graph) {
    // Use Dijkstra's algorithm to find shortest path
    let unvisited = graph.nodes.slice();
    let visited = [];
    while (unvisited.length != 0) {
        unvisited.sort((a, b) => a.distance - b.distance);
        let curNode = unvisited.shift();
        let leftNode = curNode.turnLeft;
        if (leftNode === undefined) {
            throw new Error(`Node ${curNode} has no turnLeft`);
        }
        let newLeftDistance = curNode.distance + 1000;
        if (newLeftDistance <= leftNode.distance) {
            let newPaths = curNode.paths.map((x) => x.slice());
            for (let newPath of newPaths) {
                newPath.push([leftNode.position[0], leftNode.position[1], leftNode.direction]);
            }
            leftNode.paths = (newLeftDistance == leftNode.distance) ? leftNode.paths.concat(newPaths) : newPaths;
            leftNode.distance = newLeftDistance;
        }
        let rightNode = curNode.turnRight;
        if (rightNode === undefined) {
            throw new Error(`Node ${curNode} has no turnRight`);
        }
        let newRightDistance = curNode.distance + 1000;
        if (newRightDistance <= rightNode.distance) {
            let newPaths = curNode.paths.map((x) => x.slice());
            for (let newPath of newPaths) {
                newPath.push([rightNode.position[0], rightNode.position[1], rightNode.direction]);
            }
            rightNode.paths = (newRightDistance == rightNode.distance) ? rightNode.paths.concat(newPaths) : newPaths;
            rightNode.distance = newRightDistance;
        }
        if (curNode.forward != null) {
            let forwardNode = curNode.forward;
            let newForwardDistance = curNode.distance + 1;
            if (newForwardDistance <= forwardNode.distance) {
                let newPaths = curNode.paths.map((x) => x.slice());
                for (let newPath of newPaths) {
                    newPath.push([forwardNode.position[0], forwardNode.position[1], forwardNode.direction]);
                }
                forwardNode.paths = (newForwardDistance == forwardNode.distance) ? forwardNode.paths.concat(newPaths) : newPaths;
                forwardNode.distance = newForwardDistance;
            }
        }
        visited.push(curNode);
    }
}
