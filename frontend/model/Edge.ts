import { NodeID } from "./types";

export class Edge {
  from: NodeID;
  to: NodeID;
  label?: string;

  constructor(params: { from: NodeID; to: NodeID; label?: string }) {
    this.from = params.from;
    this.to = params.to;
    this.label = params.label;
  }
}

