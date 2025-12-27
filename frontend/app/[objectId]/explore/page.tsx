import { ExploreView } from "@/components/ExploreView";
import graphData from "@/data/brama_florianska.json";

interface PageProps {
  params: Promise<{
    objectId: string;
  }>;
}

export default async function ExplorePage({ params }: PageProps) {
  const { objectId } = await params;
  
  // Na razie używamy tylko danych bramy floriańskiej
  // W przyszłości można ładować różne grafy na podstawie objectId
  const nodes = graphData.nodes;
  const edges = graphData.edges;
  
  // Znajdź root node (pierwszy węzeł lub ten z "root" w id)
  const rootNode = nodes.find(n => n.id.includes("root")) || nodes[0];
  
  return (
    <ExploreView
      nodes={nodes}
      edges={edges}
      rootNodeId={rootNode.id}
      objectId={objectId}
    />
  );
}

