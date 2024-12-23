export function partOne(input) {
    let connections = [];
    try {
        connections = input.trim().split("\n");
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph = buildGraph(connections);
        // Find all triangles
        let triangles = [];
        for (let edge of graph.edges) {
            let node1 = edge.nodes[0];
            let node2 = edge.nodes[1];
            let otherNodes = graph.nodes.filter((x) => !edge.nodes.includes(x));
            for (let node of otherNodes) {
                if (triangles.some((x) => x.includes(node) && x.includes(node1) && x.includes(node2))) {
                    continue;
                }
                let edge1 = graph.edges.find((x) => x.nodes.includes(node) && x.nodes.includes(node1));
                if (edge1 == undefined) {
                    continue;
                }
                let edge2 = graph.edges.find((x) => x.nodes.includes(node) && x.nodes.includes(node2));
                if (edge2 == undefined) {
                    continue;
                }
                let triangle = [node, node1, node2];
                triangles.push(triangle);
            }
        }
        let tTris = triangles.filter((x) => x.some((y) => y.name.startsWith("t")));
        return String(tTris.length);
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
export function partTwo(input) {
    let connections = [];
    try {
        connections = input.trim().split("\n");
    }
    catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph = buildGraph(connections);
        // Find all maximal cliques using Bron-Kerbosch algorithm
        let cliques = bronKerbosch(new Set(), new Set(graph.nodes), new Set());
        let cliquesArray = [...cliques];
        cliquesArray.sort((a, b) => a.size - b.size);
        let maximumClique = cliquesArray[cliquesArray.length - 1];
        let maxNodes = [...maximumClique];
        maxNodes.sort((a, b) => a.name.localeCompare(b.name));
        return maxNodes.map((x) => x.name).join(",");
    }
    catch (err) {
        console.log(err);
        return "Error during solving";
    }
}
function buildGraph(connections) {
    // Build graph
    let graph = { nodes: [], edges: [] };
    for (let conn of connections) {
        let nodes = conn.split("-");
        let node1;
        let node2;
        let existingNode1 = graph.nodes.find((x) => x.name == nodes[0]);
        if (existingNode1 == undefined) {
            node1 = { name: nodes[0], neighbours: [] };
            graph.nodes.push(node1);
        }
        else {
            node1 = existingNode1;
        }
        let existingNode2 = graph.nodes.find((x) => x.name == nodes[1]);
        if (existingNode2 == undefined) {
            node2 = { name: nodes[1], neighbours: [] };
            graph.nodes.push(node2);
        }
        else {
            node2 = existingNode2;
        }
        let edge = { nodes: [node1, node2] };
        graph.edges.push(edge);
        node1.neighbours.push(node2);
        node2.neighbours.push(node1);
    }
    return graph;
}
function bronKerbosch(setR, setP, setX) {
    let cliques = new Set();
    if (setP.size == 0 && setX.size == 0) {
        cliques.add(new Set(setR));
    }
    for (let v of setP) {
        let newR = new Set(setR);
        newR.add(v);
        let newP = new Set([...setP].filter((n) => v.neighbours.includes(n)));
        let newX = new Set([...setX].filter((n) => v.neighbours.includes(n)));
        cliques = new Set([...cliques, ...bronKerbosch(newR, newP, newX)]);
        setP.delete(v);
        setX.add(v);
    }
    return cliques;
}
