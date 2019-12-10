const Graph = require('graph-data-structure');

// Graph of all the stops
class BusGraph {
    constructor(list_of_stops){
        this.graph = Graph();
    }

    addNode(node){
       if(node instanceof GNode) {
            this.graph.addNode(node);
       }
    }
    // stop_a and stop_b should be id's for the stops
    async addEdge(stop_a, stop_b, dist_matrix){
        // if(stop_a instanceof GNode && stop_b instanceof GNode) {
        //     this.graph.addEdge(stop_a,stop_b,dist_matrix);
        // }
         this.graph.addEdge(stop_a,stop_b,dist_matrix);
    }

    async topSort(){
        return this.graph.topologicalSort();
    }

    async stringify(){
        return this.graph.serialize();
    }

    async dfs(){
        return this.graph.depthFirstSearch();
    }

    async adjStop(stop){
        return this.graph.adjacent(stop)
    }
}

// A bus stop in the graph, G for graph.
class GNode {
   constructor(name,position,routes){
        this.name = name;
        this.position = position;
        this.routes = routes;
   }
}

module.exports.Graph = BusGraph;
module.exports.GNode = GNode;
