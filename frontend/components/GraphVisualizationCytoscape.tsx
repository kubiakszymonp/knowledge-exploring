"use client";

import { useRef, useEffect, useState } from "react";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { KnowledgeGraph } from "../model/KnowledgeGraph";
import { KnowledgeNode } from "../model/KnowledgeNode";
import { Edge } from "../model/Edge";
import EditorDrawer from "./EditorDrawer";

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

    // Oblicz głębokość każdego węzła
    const depths = new Map<string, number>();
    const rootNode = graph.getRootNode();
    
    if (rootNode) {
      const queue: Array<{ id: string; depth: number }> = [
        { id: rootNode.id, depth: 0 },
      ];
      depths.set(rootNode.id, 0);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const outgoing = graph.getOutgoingEdges(current.id);

        outgoing.forEach((edge) => {
          if (!depths.has(edge.to)) {
            const newDepth = current.depth + 1;
            depths.set(edge.to, newDepth);
            queue.push({ id: edge.to, depth: newDepth });
          }
        });
      }
    }

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
            "text-overflow-wrap": "whitespace",
            width: 100,
            height: 45,
            shape: "roundrectangle",
            "border-width": 1,
            "border-color": "#cbd5e1",
            "overlay-opacity": 0,
            "padding": "2px",
          },
        },
        {
          selector: "node[?isRoot]",
          style: {
            "background-color": "#e0e7ff",
            "border-color": "#818cf8",
            "border-width": 1,
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
          selector: "node[?isRoot]:selected",
          style: {
            "background-color": "#fef3c7",
            "border-color": "#f59e0b",
          },
        },
        {
          selector: "node:active",
          style: {
            "overlay-opacity": 0,
          },
        },
        {
          selector: "node:grabbed",
          style: {
            "overlay-opacity": 0,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#cbd5e1",
            "target-arrow-color": "#cbd5e1",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.8,
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            color: "#64748b",
            "text-background-color": "#ffffff",
            "text-background-opacity": 1,
            "text-background-padding": "3px",
            "text-margin-y": -10,
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 2.5,
            "line-color": "#fbbf24",
            "target-arrow-color": "#fbbf24",
          },
        },
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        circle: true,
        spacingFactor: 1.8,
        padding: 40,
        avoidOverlap: true,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.5,
      maxZoom: 2,
    });

    cyRef.current.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      const node = graph.getNode(nodeId);
      if (node) {
        setSelected({ type: "node", data: node });
      }
    });

    cyRef.current.on("tap", "edge", (evt) => {
      const edgeIndex = evt.target.data("edgeIndex");
      const edge = graph.getAllEdges()[edgeIndex];
      if (edge) {
        setSelected({ type: "edge", data: edge });
      }
    });

    cyRef.current.on("tap", (evt) => {
      if (evt.target === cyRef.current) {
        setSelected(null);
      }
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [graph]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          Graf Wiedzy:{" "}
          <span className="text-indigo-600">{rootNode?.title || "Nieznany"}</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Wizualizacja struktury wiedzy • {graph.getAllNodes().length} węzłów •{" "}
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
