"use client";

import { useRef, useEffect, useState } from "react";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import cytoscapeDagre from "cytoscape-dagre";
import { KnowledgeGraph } from "../model/KnowledgeGraph";
import { KnowledgeNode } from "../model/KnowledgeNode";
import { Edge } from "../model/Edge";
import EditorDrawer from "./EditorDrawer";

cytoscape.use(cytoscapeDagre);

interface GraphVisualizationCytoscapeProps {
  graph: KnowledgeGraph;
}

type SelectedElement =
  | { type: "node"; data: KnowledgeNode }
  | { type: "edge"; data: Edge }
  | null;

function graphToCytoscape(graph: KnowledgeGraph): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  const rootNode = graph.getRootNode();

  graph.getAllNodes().forEach((node) => {
    const isRoot = node.id === rootNode?.id;
    elements.push({
      data: {
        id: node.id,
        label: node.title,
        isRoot,
      },
    });
  });

  graph.getAllEdges().forEach((edge, index) => {
    elements.push({
      data: {
        id: `edge-${index}`,
        source: edge.from,
        target: edge.to,
        label: edge.label || "",
        edgeIndex: index,
      },
    });
  });

  return elements;
}

export default function GraphVisualizationCytoscape({
  graph,
}: GraphVisualizationCytoscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selected, setSelected] = useState<SelectedElement>(null);
  const rootNode = graph.getRootNode();

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = graphToCytoscape(graph);

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#f1f5f9",
            label: "data(label)",
            color: "#334155",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "10px",
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "90px",
            width: 110,
            height: 45,
            shape: "roundrectangle",
            "border-width": 1,
            "border-color": "#cbd5e1",
            "overlay-opacity": 0,
          },
        },
        {
          selector: "node[?isRoot]",
          style: {
            "background-color": "#e0e7ff",
            "border-color": "#818cf8",
            "border-width": 2,
          },
        },
        {
          selector: "node:selected",
          style: {
            "background-color": "#fef9c3",
            "border-width": 3,
            "border-color": "#fbbf24",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#cbd5e1",
            "target-arrow-color": "#cbd5e1",
            "target-arrow-shape": "triangle",
            "arrow-scale": 1,
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            color: "#64748b",
            "text-background-color": "#ffffff",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-margin-y": -10,
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 3,
            "line-color": "#fbbf24",
            "target-arrow-color": "#fbbf24",
          },
        },
      ],

      // ⭐⭐⭐ DAGRE LAYOUT — piękne drzewo pionowe
      layout: {
        name: "dagre",
        rankDir: "TB",    // top → bottom
        rankSep: 80,      // pionowe odstępy
        nodeSep: 60,      // poziome odstępy
        edgeSep: 20,
        padding: 50,
        animate: false,
      },

      minZoom: 0.3,
      maxZoom: 2,
    });

    // --- Kliknięcia ---
    cyRef.current.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      const node = graph.getNode(nodeId);
      if (node) setSelected({ type: "node", data: node });
    });

    cyRef.current.on("tap", "edge", (evt) => {
      const index = evt.target.data("edgeIndex");
      const edge = graph.getAllEdges()[index];
      if (edge) setSelected({ type: "edge", data: edge });
    });

    cyRef.current.on("tap", (evt) => {
      if (evt.target === cyRef.current) setSelected(null);
    });

    return () => cyRef.current?.destroy();
  }, [graph]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          Graf Wiedzy:{" "}
          <span className="text-indigo-600">{rootNode?.title || "Nieznany"}</span>
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          Wizualizacja struktury • {graph.getAllNodes().length} węzłów •{" "}
          {graph.getAllEdges().length} połączeń
        </p>
      </header>

      <main className="flex-1 relative">
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </main>

      <EditorDrawer
        selected={selected}
        onClose={() => setSelected(null)}
        graph={graph}
      />
    </div>
  );
}
