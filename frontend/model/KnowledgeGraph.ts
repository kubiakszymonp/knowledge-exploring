import { NodeID } from "./types";
import { KnowledgeNode } from "./KnowledgeNode";
import { Edge } from "./Edge";

export class KnowledgeGraph {
  private nodes: Map<NodeID, KnowledgeNode> = new Map();
  private edges: Edge[] = [];

  addNode(node: KnowledgeNode): void {
    this.nodes.set(node.id, node);
  }

  getNode(id: NodeID): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): KnowledgeNode[] {
    return [...this.nodes.values()];
  }

  getRootNode(): KnowledgeNode | undefined {
    const allNodes = this.getAllNodes();
    return allNodes.find((node) => this.getIncomingEdges(node.id).length === 0);
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  getAllEdges(): Edge[] {
    return this.edges;
  }

  getOutgoingEdges(nodeId: NodeID): Edge[] {
    return this.edges.filter((e) => e.from === nodeId);
  }

  getIncomingEdges(nodeId: NodeID): Edge[] {
    return this.edges.filter((e) => e.to === nodeId);
  }

  getNeighbors(nodeId: NodeID): KnowledgeNode[] {
    const outgoing = this.getOutgoingEdges(nodeId)
      .map((e) => this.nodes.get(e.to))
      .filter((n): n is KnowledgeNode => !!n);

    const incoming = this.getIncomingEdges(nodeId)
      .map((e) => this.nodes.get(e.from))
      .filter((n): n is KnowledgeNode => !!n);

    const unique = new Map<NodeID, KnowledgeNode>();
    [...outgoing, ...incoming].forEach((n) => unique.set(n.id, n));
    return [...unique.values()];
  }

  toJSON() {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
    };
  }
}
