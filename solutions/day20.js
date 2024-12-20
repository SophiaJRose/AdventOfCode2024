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
        let endNode = graph.nodes.find((x) => x.position[0] == end[0] && x.position[1] == end[1]);
        if (endNode == undefined) {
            throw new Error("End not reachable from start");
        }
        // Find all possible cheats
        let cheats = [];
        let nodes = graph.nodes;
        for (let node of nodes) {
            if (node.up === null) {
                let nodeThroughWall = nodes.find((x) => x.position[0] == node.position[0] - 2 && x.position[1] == node.position[1]);
                if (nodeThroughWall != undefined) {
                    let timesave = nodeThroughWall.distance - node.distance - 2;
                    // Don't save cheats that don't save time
                    if (timesave > 0) {
                        let cheat = { start: node.position, end: nodeThroughWall.position, length: 2, timesave: timesave };
                        cheats.push(cheat);
                    }
                }
            }
            if (node.down === null) {
                let nodeThroughWall = nodes.find((x) => x.position[0] == node.position[0] + 2 && x.position[1] == node.position[1]);
                if (nodeThroughWall != undefined) {
                    let timesave = nodeThroughWall.distance - node.distance - 2;
                    if (timesave > 0) {
                        let cheat = { start: node.position, end: nodeThroughWall.position, length: 2, timesave: timesave };
                        cheats.push(cheat);
                    }
                }
            }
            if (node.left === null) {
                let nodeThroughWall = nodes.find((x) => x.position[0] == node.position[0] && x.position[1] == node.position[1] - 2);
                if (nodeThroughWall != undefined) {
                    let timesave = nodeThroughWall.distance - node.distance - 2;
                    if (timesave > 0) {
                        let cheat = { start: node.position, end: nodeThroughWall.position, length: 2, timesave: timesave };
                        cheats.push(cheat);
                    }
                }
            }
            if (node.right === null) {
                let nodeThroughWall = nodes.find((x) => x.position[0] == node.position[0] && x.position[1] == node.position[1] + 2);
                if (nodeThroughWall != undefined) {
                    let timesave = nodeThroughWall.distance - node.distance - 2;
                    if (timesave > 0) {
                        let cheat = { start: node.position, end: nodeThroughWall.position, length: 2, timesave: timesave };
                        cheats.push(cheat);
                    }
                }
            }
        }
        return String(cheats.filter((x) => x.timesave >= 100).length);
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
        let endNode = graph.nodes.find((x) => x.position[0] == end[0] && x.position[1] == end[1]);
        if (endNode == undefined) {
            throw new Error("End not reachable from start");
        }
        let cheats = [];
        let nodes = graph.nodes;
        for (let node of nodes) {
            let reachableNodes = nodes.filter((x) => Math.abs(x.position[0] - node.position[0]) + Math.abs(x.position[1] - node.position[1]) <= 20);
            for (let rNode of reachableNodes) {
                let cheatLength = Math.abs(rNode.position[0] - node.position[0]) + Math.abs(rNode.position[1] - node.position[1]);
                let timesave = rNode.distance - node.distance - cheatLength;
                if (timesave > 0) {
                    let cheat = { start: node.position, end: rNode.position, length: cheatLength, timesave: timesave };
                    cheats.push(cheat);
                }
            }
        }
        return String(cheats.filter((x) => x.timesave >= 100).length);
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
    let graph = { nodes: [] };
    let startNode = { position: start, up: undefined, down: undefined, left: undefined, right: undefined, distance: 0 };
    graph.nodes.push(startNode);
    let queue = [startNode];
    while (queue.length != 0) {
        let curNode = queue.shift();
        if (curNode.up === undefined) {
            let upPos = [curNode.position[0] - 1, curNode.position[1]];
            let existingNode = graph.nodes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1]);
            if (existingNode !== undefined) {
                curNode.up = existingNode;
            }
            else {
                let up = grid[upPos[0]][upPos[1]];
                if (up == "." || up == "E") {
                    let upNode = { position: upPos, up: undefined, down: curNode, left: undefined, right: undefined, distance: Number.POSITIVE_INFINITY };
                    curNode.up = upNode;
                    graph.nodes.push(upNode);
                    queue.push(upNode);
                }
                else {
                    curNode.up = null;
                }
            }
        }
        if (curNode.down === undefined) {
            let downPos = [curNode.position[0] + 1, curNode.position[1]];
            let existingNode = graph.nodes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1]);
            if (existingNode !== undefined) {
                curNode.down = existingNode;
            }
            else {
                let down = grid[downPos[0]][downPos[1]];
                if (down == "." || down == "E") {
                    let downNode = { position: downPos, up: curNode, down: undefined, left: undefined, right: undefined, distance: Number.POSITIVE_INFINITY };
                    curNode.down = downNode;
                    graph.nodes.push(downNode);
                    queue.push(downNode);
                }
                else {
                    curNode.down = null;
                }
            }
        }
        if (curNode.left === undefined) {
            let leftPos = [curNode.position[0], curNode.position[1] - 1];
            let existingNode = graph.nodes.find((x) => x.position[0] == leftPos[0] && x.position[1] == leftPos[1]);
            if (existingNode !== undefined) {
                curNode.left = existingNode;
            }
            else {
                let left = grid[leftPos[0]][leftPos[1]];
                if (left == "." || left == "E") {
                    let leftNode = { position: leftPos, up: undefined, down: undefined, left: undefined, right: curNode, distance: Number.POSITIVE_INFINITY };
                    curNode.left = leftNode;
                    graph.nodes.push(leftNode);
                    queue.push(leftNode);
                }
                else {
                    curNode.left = null;
                }
            }
        }
        if (curNode.right === undefined) {
            let rightPos = [curNode.position[0], curNode.position[1] + 1];
            let existingNode = graph.nodes.find((x) => x.position[0] == rightPos[0] && x.position[1] == rightPos[1]);
            if (existingNode !== undefined) {
                curNode.right = existingNode;
            }
            else {
                let right = grid[rightPos[0]][rightPos[1]];
                if (right == "." || right == "E") {
                    let rightNode = { position: rightPos, up: undefined, down: undefined, left: curNode, right: undefined, distance: Number.POSITIVE_INFINITY };
                    curNode.right = rightNode;
                    graph.nodes.push(rightNode);
                    queue.push(rightNode);
                }
                else {
                    curNode.right = null;
                }
            }
        }
    }
    return graph;
}
function dijkstra(graph) {
    let unvisited = graph.nodes.slice();
    let visited = [];
    while (unvisited.length != 0) {
        unvisited.sort((a, b) => a.distance - b.distance);
        let curNode = unvisited.shift();
        if (curNode.up != null) {
            let upNode = curNode.up;
            let newUpDistance = curNode.distance + 1;
            if (newUpDistance <= upNode.distance) {
                upNode.distance = newUpDistance;
            }
        }
        if (curNode.down != null) {
            let downNode = curNode.down;
            let newDownDistance = curNode.distance + 1;
            if (newDownDistance <= downNode.distance) {
                downNode.distance = newDownDistance;
            }
        }
        if (curNode.left != null) {
            let leftNode = curNode.left;
            let newLeftDistance = curNode.distance + 1;
            if (newLeftDistance <= leftNode.distance) {
                leftNode.distance = newLeftDistance;
            }
        }
        if (curNode.right != null) {
            let rightNode = curNode.right;
            let newRightDistance = curNode.distance + 1;
            if (newRightDistance <= rightNode.distance) {
                rightNode.distance = newRightDistance;
            }
        }
        visited.push(curNode);
    }
}
