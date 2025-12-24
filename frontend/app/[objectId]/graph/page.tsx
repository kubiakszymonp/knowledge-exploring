"use client";

import { useMemo } from "react";
import GraphVisualizationCytoscape from "../../../components/GraphVisualizationCytoscape";
import { createMockGraph } from "../../../lib/mockData";

export default function GraphPage() {
  const graph = useMemo(() => createMockGraph(), []);

  return <GraphVisualizationCytoscape graph={graph} />;
}
