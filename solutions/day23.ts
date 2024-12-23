type Node = {
    name: string,
    neighbours: Node[]
}

type Edge = {
    nodes: Node[]
}

type Graph = {
    nodes: Node[],
    edges: Edge[]
}

export function partOne(input: string): string {
    let connections: string[] = [];
    try {
        connections = input.trim().split("\n");
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph: Graph = buildGraph(connections);
        // Find all triangles
        let triangles: Node[][] = [];
        for (let edge of graph.edges) {
            let node1: Node = edge.nodes[0];
            let node2: Node = edge.nodes[1];
            let otherNodes: Node[] = graph.nodes.filter((x) => !edge.nodes.includes(x))
            for (let node of otherNodes) {
                if (triangles.some((x) => x.includes(node) && x.includes(node1) && x.includes(node2))) {
                    continue;
                }
                let edge1: Edge | undefined = graph.edges.find((x) => x.nodes.includes(node) && x.nodes.includes(node1));
                if (edge1 == undefined) {
                    continue;
                }
                let edge2: Edge | undefined = graph.edges.find((x) => x.nodes.includes(node) && x.nodes.includes(node2));
                if (edge2 == undefined) {
                    continue;
                }
                let triangle: Node[] = [node, node1, node2];
                triangles.push(triangle);
            }
        }
        let tTris: Node[][] = triangles.filter((x) => x.some((y) => y.name.startsWith("t")));
        return String(tTris.length);
    } catch (err) {
        console.log(err);
        return "Error during solving"
    }
}

export function partTwo(input: string): string {
    let connections: string[] = [];
    try {
        connections = input.trim().split("\n");
    } catch (err) {
        console.log(err);
        return "Error parsing input";
    }
    try {
        let graph: Graph = buildGraph(connections);
        // Find all maximal cliques using Bron-Kerbosch algorithm
        let cliques: Set<Set<Node>> = bronKerbosch(new Set(), new Set(graph.nodes), new Set());
        let cliquesArray: Set<Node>[] = [...cliques];
        cliquesArray.sort((a, b) => a.size - b.size);
        let maximumClique: Set<Node> = cliquesArray[cliquesArray.length-1];
        let maxNodes: Node[] = [...maximumClique];
        maxNodes.sort((a, b) => a.name.localeCompare(b.name));
        return maxNodes.map((x) => x.name).join(",");
    } catch (err) {
        console.log(err);
        return "Error during solving"
    }
}

function buildGraph(connections: string[]): Graph {
    // Build graph
    let graph: Graph = {nodes: [], edges: []};
    for (let conn of connections) {
        let nodes: string[] = conn.split("-");
        let node1: Node;
        let node2: Node;
        let existingNode1: Node | undefined = graph.nodes.find((x) => x.name == nodes[0]);
        if (existingNode1 == undefined) {
            node1 = {name: nodes[0], neighbours: []};
            graph.nodes.push(node1);
        } else {
            node1 = existingNode1;
        }
        let existingNode2: Node | undefined = graph.nodes.find((x) => x.name == nodes[1]);
        if (existingNode2 == undefined) {
            node2 = {name: nodes[1], neighbours: []};
            graph.nodes.push(node2);
        } else {
            node2 = existingNode2;
        }
        let edge: Edge = {nodes: [node1, node2]};
        graph.edges.push(edge);
        node1.neighbours.push(node2);
        node2.neighbours.push(node1);
    }
    return graph;
}

function bronKerbosch(setR: Set<Node>, setP: Set<Node>, setX: Set<Node>): Set<Set<Node>> {
    let cliques: Set<Set<Node>> = new Set();
    if (setP.size == 0 && setX.size == 0) {
        cliques.add(new Set(setR));
    }
    for (let v of setP) {
        let newR: Set<Node> = new Set(setR);
        newR.add(v);
        let newP: Set<Node> = new Set([...setP].filter((n) => v.neighbours.includes(n)));
        let newX: Set<Node> = new Set([...setX].filter((n) => v.neighbours.includes(n)));
        cliques = new Set([...cliques, ...bronKerbosch(newR, newP, newX)]);
        setP.delete(v);
        setX.add(v);
    }
    return cliques;
}