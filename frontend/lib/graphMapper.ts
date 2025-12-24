import { KnowledgeGraph } from "../model/KnowledgeGraph";
import { KnowledgeNode } from "../model/KnowledgeNode";
import { Edge } from "../model/Edge";
import { Attachment } from "../model/Attachment";

export interface GraphJSON {
  nodes: {
    id: string;
    title: string;
    text: string;
    tags?: string[];
    meta?: Record<string, any>;
    attachments?: {
      id: string;
      type: "image" | "video" | "audio" | "map" | "document";
      url: string;
      description?: string;
      meta?: Record<string, any>;
    }[];
  }[];
  edges: {
    from: string;
    to: string;
    label?: string;
  }[];
}

export function mapJSONToGraph(json: GraphJSON): KnowledgeGraph {
  const graph = new KnowledgeGraph();

  json.nodes.forEach((nodeData) => {
    const attachments = nodeData.attachments?.map(
      (att) =>
        new Attachment({
          id: att.id,
          type: att.type,
          url: att.url,
          description: att.description,
          meta: att.meta,
        })
    );

    const node = new KnowledgeNode({
      id: nodeData.id,
      title: nodeData.title,
      text: nodeData.text,
      tags: nodeData.tags,
      meta: nodeData.meta,
      attachments,
    });

    graph.addNode(node);
  });

  json.edges.forEach((edgeData) => {
    const edge = new Edge({
      from: edgeData.from,
      to: edgeData.to,
      label: edgeData.label,
    });

    graph.addEdge(edge);
  });

  return graph;
}

