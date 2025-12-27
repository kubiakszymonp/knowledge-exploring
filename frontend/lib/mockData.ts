import { KnowledgeGraph } from "../model/KnowledgeGraph";
import { mapJSONToGraph } from "./graphMapper";
import graphData from "../data/brama_florianska.json";
import type { GraphJSON } from "./graphMapper";

export function createMockGraph(): KnowledgeGraph {
  return mapJSONToGraph(graphData as GraphJSON);
}
