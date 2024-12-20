export function partOne(input) {
    let bytes = [];
    try {
        let lines = input.trim().split("\n");
        bytes = lines.map((x) => x.split(",").map((n) => Number(n)));
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        const height = 71;
        const width = 71;
        let graph = buildGraph(height, width);
        // Place falling bytes
        const numBytes = 1024;
        for (let i = 0; i < numBytes; i++) {
            let byte = bytes[i];
            // byte co-ords are stored x,y so swap for i,j
            let byteNode = graph.nodes.find((x) => x.position[0] == byte[1] && x.position[1] == byte[0]);
            if (byteNode === undefined) {
                throw new Error(`Graph does not contain node at ${byte}`);
            }
            // Remove connections to byteNode to make it unreachable
            if (byteNode.up != null) {
                byteNode.up.down = null;
            }
            if (byteNode.down != null) {
                byteNode.down.up = null;
            }
            if (byteNode.left != null) {
                byteNode.left.right = null;
            }
            if (byteNode.right != null) {
                byteNode.right.left = null;
            }
        }
        // Use Dijkstra's algorithm to find path
        dijkstra(graph);
        let endNode = graph.nodes.find((x) => x.position[0] == height - 1 && x.position[1] == width - 1);
        if (endNode == undefined) {
            throw new Error("Graph does not include end");
        }
        if (endNode.distance == Number.POSITIVE_INFINITY) {
            throw new Error("End is not reachable from start");
        }
        return String(endNode.distance);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let bytes = [];
    try {
        let lines = input.trim().split("\n");
        bytes = lines.map((x) => x.split(",").map((n) => Number(n)));
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        const height = 71;
        const width = 71;
        let graph = buildGraph(height, width);
        // Get shortest path
        dijkstra(graph);
        let endNode = graph.nodes.find((x) => x.position[0] == height - 1 && x.position[1] == width - 1);
        if (endNode == undefined) {
            throw new Error("Graph does not include end");
        }
        if (endNode.distance == Number.POSITIVE_INFINITY) {
            throw new Error("End is not reachable from start before any bytes have falled");
        }
        let path = endNode.distPath;
        // Place falling bytes until end not reachable
        for (let byte of bytes) {
            // byte co-ords are stored x,y so swap for i,j
            let byteNode = graph.nodes.find((x) => x.position[0] == byte[1] && x.position[1] == byte[0]);
            if (byteNode === undefined) {
                throw new Error(`Graph does not contain node at ${byte}`);
            }
            // Remove connections to byteNode to make it unreachable
            if (byteNode.up != null) {
                byteNode.up.down = null;
            }
            if (byteNode.down != null) {
                byteNode.down.up = null;
            }
            if (byteNode.left != null) {
                byteNode.left.right = null;
            }
            if (byteNode.right != null) {
                byteNode.right.left = null;
            }
            // If byte was on current shortest path, recalculate
            if (path.some((x) => x[0] == byte[1] && x[1] == byte[0])) {
                dijkstra(graph);
                let endNode = graph.nodes.find((x) => x.position[0] == height - 1 && x.position[1] == width - 1);
                if (endNode == undefined) {
                    throw new Error("Graph does not include end");
                }
                // If end can no longer be reached, return byte
                if (endNode.distance == Number.POSITIVE_INFINITY) {
                    return byte.join(",");
                }
                path = endNode.distPath;
            }
        }
        // If all bytes processed and end still reachable, error
        throw new Error("End never became unreachable.");
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function buildGraph(height, width) {
    let graph = { nodes: [] };
    let startNode = { position: [0, 0], up: undefined, down: undefined, left: undefined, right: undefined, distance: 0, distPath: [[0, 0]] };
    graph.nodes.push(startNode);
    let queue = [startNode];
    while (queue.length != 0) {
        let curNode = queue.shift();
        if (curNode.up === undefined) {
            if (curNode.position[0] == 0) {
                curNode.up = null;
            }
            else {
                let upPos = [curNode.position[0] - 1, curNode.position[1]];
                let existingNode = graph.nodes.find((x) => x.position[0] == upPos[0] && x.position[1] == upPos[1]);
                if (existingNode != undefined) {
                    curNode.up = existingNode;
                    existingNode.down = curNode;
                }
                else {
                    let upNode = { position: upPos, up: undefined, down: curNode, left: undefined, right: undefined, distance: Number.POSITIVE_INFINITY, distPath: [] };
                    curNode.up = upNode;
                    graph.nodes.push(upNode);
                    queue.push(upNode);
                }
            }
        }
        if (curNode.down === undefined) {
            if (curNode.position[0] == height - 1) {
                curNode.down = null;
            }
            else {
                let downPos = [curNode.position[0] + 1, curNode.position[1]];
                let existingNode = graph.nodes.find((x) => x.position[0] == downPos[0] && x.position[1] == downPos[1]);
                if (existingNode != undefined) {
                    curNode.down = existingNode;
                    existingNode.up = curNode;
                }
                else {
                    let downNode = { position: downPos, up: curNode, down: undefined, left: undefined, right: undefined, distance: Number.POSITIVE_INFINITY, distPath: [] };
                    curNode.down = downNode;
                    graph.nodes.push(downNode);
                    queue.push(downNode);
                }
            }
        }
        if (curNode.left === undefined) {
            if (curNode.position[1] == 0) {
                curNode.left = null;
            }
            else {
                let leftPos = [curNode.position[0], curNode.position[1] - 1];
                let existingNode = graph.nodes.find((x) => x.position[0] == leftPos[0] && x.position[1] == leftPos[1]);
                if (existingNode != undefined) {
                    curNode.left = existingNode;
                    existingNode.down = curNode;
                }
                else {
                    let leftNode = { position: leftPos, up: undefined, down: undefined, left: undefined, right: curNode, distance: Number.POSITIVE_INFINITY, distPath: [] };
                    curNode.left = leftNode;
                    graph.nodes.push(leftNode);
                    queue.push(leftNode);
                }
            }
        }
        if (curNode.right === undefined) {
            if (curNode.position[1] == width - 1) {
                curNode.right = null;
            }
            else {
                let rightPos = [curNode.position[0], curNode.position[1] + 1];
                let existingNode = graph.nodes.find((x) => x.position[0] == rightPos[0] && x.position[1] == rightPos[1]);
                if (existingNode != undefined) {
                    curNode.right = existingNode;
                    existingNode.down = curNode;
                }
                else {
                    let rightNode = { position: rightPos, up: undefined, down: undefined, left: curNode, right: undefined, distance: Number.POSITIVE_INFINITY, distPath: [] };
                    curNode.right = rightNode;
                    graph.nodes.push(rightNode);
                    queue.push(rightNode);
                }
            }
        }
    }
    return graph;
}
function dijkstra(graph) {
    let unvisited = graph.nodes.slice();
    // Reset distances and paths for all nodes except start
    for (let node of unvisited) {
        if (node.position[0] == 0 && node.position[1] == 0) {
            continue;
        }
        node.distance = Number.POSITIVE_INFINITY;
        node.distPath = [];
    }
    let visited = [];
    while (unvisited.length != 0) {
        unvisited.sort((a, b) => a.distance - b.distance);
        let curNode = unvisited.shift();
        if (curNode.up != null) {
            let upNode = curNode.up;
            let upNodeDistance = upNode.distance;
            let newDistance = curNode.distance + 1;
            if (newDistance <= upNodeDistance) {
                upNode.distance = newDistance;
                let newPath = curNode.distPath.slice();
                newPath.push(upNode.position);
                upNode.distPath = newPath;
            }
        }
        if (curNode.down != null) {
            let downNode = curNode.down;
            let downNodeDistance = downNode.distance;
            let newDistance = curNode.distance + 1;
            if (newDistance <= downNodeDistance) {
                downNode.distance = newDistance;
                let newPath = curNode.distPath.slice();
                newPath.push(downNode.position);
                downNode.distPath = newPath;
            }
        }
        if (curNode.left != null) {
            let leftNode = curNode.left;
            let leftNodeDistance = leftNode.distance;
            let newDistance = curNode.distance + 1;
            if (newDistance <= leftNodeDistance) {
                leftNode.distance = newDistance;
                let newPath = curNode.distPath.slice();
                newPath.push(leftNode.position);
                leftNode.distPath = newPath;
            }
        }
        if (curNode.right != null) {
            let rightNode = curNode.right;
            let rightNodeDistance = rightNode.distance;
            let newDistance = curNode.distance + 1;
            if (newDistance <= rightNodeDistance) {
                rightNode.distance = newDistance;
                let newPath = curNode.distPath.slice();
                newPath.push(rightNode.position);
                rightNode.distPath = newPath;
            }
        }
        visited.push(curNode);
    }
}
