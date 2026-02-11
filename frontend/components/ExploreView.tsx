"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { StyleSettings } from "@/components/StyleSettings";
import { ArticleSection } from "@/components/ArticleSection";
import { ExplorationQuestions } from "@/components/ExplorationQuestions";
import { FloatingAudioPlayer } from "@/components/FloatingAudioPlayer";
import { Button } from "@/components/ui/button";
import {
  getNodeStylization,
  getEdgeStylization,
  StylizedArticle,
  StylizedEdge,
} from "@/lib/loadStylizations";
import { useUserConfig } from "@/contexts/UserConfigContext";

interface KnowledgeNode {
  id: string;
  title: string;
  text: string;
  tags: string[];
  attachments?: { id: string; type: string; url: string; description: string }[];
}

interface KnowledgeEdge {
  from: string;
  to: string;
}

interface ExploreViewProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  rootNodeId: string;
  objectId: string;
}

interface DiscoveredSection {
  nodeId: string;
  article: StylizedArticle | null;
  node: KnowledgeNode;
}

interface QuestionOption {
  edge: KnowledgeEdge;
  stylizedEdge: StylizedEdge;
  targetNode: KnowledgeNode;
}

interface RelatedPlace {
  id: string;
  name: string;
  image: string;
  description: string;
}

// Funkcja zwracająca powiązane miejsca (wykluczając aktualne miejsce)
function getRelatedPlaces(currentObjectId: string): RelatedPlace[] {
  const allPlaces: RelatedPlace[] = [
    {
      id: "brama_florianska",
      name: "Brama Floriańska",
      image: "https://picsum.photos/seed/brama-tile/600/400",
      description: "Gotycka brama miejska z XIV wieku",
    },
    {
      id: "sukiennice",
      name: "Sukiennice",
      image: "https://picsum.photos/seed/sukiennice/600/400",
      description: "Renesansowe centrum handlu",
    },
    {
      id: "wawel",
      name: "Zamek Królewski na Wawelu",
      image: "https://picsum.photos/seed/wawel-castle/600/400",
      description: "Siedziba polskich królów",
    },
    {
      id: "kosciol_mariacki",
      name: "Kościół Mariacki",
      image: "https://picsum.photos/seed/mariacki/600/400",
      description: "Gotycka bazylika z ołtarzem Wita Stwosza",
    },
    {
      id: "barbakan",
      name: "Barbakan",
      image: "https://picsum.photos/seed/barbakan/600/400",
      description: "Średniowieczna budowla obronna",
    },
    {
      id: "rynek_glowny",
      name: "Rynek Główny",
      image: "https://picsum.photos/seed/rynek/600/400",
      description: "Największy średniowieczny plac w Europie",
    },
  ];

  // Zwróć miejsca, wykluczając aktualne
  return allPlaces.filter(place => place.id !== currentObjectId).slice(0, 3);
}

export function ExploreView({ nodes, edges, rootNodeId, objectId }: ExploreViewProps) {
  const { config, updateConfig } = useUserConfig();
  const articleStyle = config.articleStyle;
  const edgeStyle = config.edgeStyle;

  const [discoveredSections, setDiscoveredSections] = useState<DiscoveredSection[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const rootNode = nodeMap.get(rootNodeId);

  // Pobierz WSZYSTKIE krawędzie prowadzące do nieodkrytych węzłów
  const getAllAvailableEdges = useCallback(
    (discoveredIds: Set<string>) => {
      return edges.filter((e) => !discoveredIds.has(e.to));
    },
    [edges]
  );

  // Pobierz pierwsze N krawędzi (stabilna kolejność)
  const pickEdges = useCallback(
    (edgeList: KnowledgeEdge[], count: number = 3) => {
      return edgeList.slice(0, count);
    },
    []
  );

  // Załaduj pytania ze wszystkich dostępnych krawędzi
  const loadQuestions = useCallback(
    async (discoveredIds: Set<string>) => {
      const availableEdges = getAllAvailableEdges(discoveredIds);
      const selectedEdges = pickEdges(availableEdges, 3);

      const allQuestions = await Promise.all(
        selectedEdges.map(async (edge) => {
          const stylizedEdge = await getEdgeStylization(
            edge.from,
            edge.to,
            edgeStyle
          );
          const targetNode = nodeMap.get(edge.to)!;
          return { edge, stylizedEdge, targetNode };
        })
      );

      // Tylko pytania z wczytaną zajawką
      const questions = allQuestions.filter(
        (q): q is QuestionOption => q.stylizedEdge !== null
      );
      setCurrentQuestions(questions);
    },
    [getAllAvailableEdges, pickEdges, edgeStyle, nodeMap]
  );

  // Inicjalizacja - załaduj root (tylko raz przy mount)
  useEffect(() => {
    const initRoot = async () => {
      if (!rootNode) return;
      setIsLoading(true);

      const article = await getNodeStylization(rootNodeId, articleStyle);
      const initialSection: DiscoveredSection = {
        nodeId: rootNodeId,
        article,
        node: rootNode,
      };

      setDiscoveredSections([initialSection]);
      await loadQuestions(new Set([rootNodeId]));
      setIsLoading(false);
    };

    initRoot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNodeId]);

  // Przeładuj stylizacje przy zmianie stylów (bez resetowania odkrytych sekcji)
  useEffect(() => {
    const reloadStylizations = async () => {
      if (discoveredSections.length === 0) return;

      // Przeładuj stylizacje dla wszystkich odkrytych sekcji
      const updatedSections = await Promise.all(
        discoveredSections.map(async (section) => {
          const article = await getNodeStylization(section.nodeId, articleStyle);
          return {
            ...section,
            article,
          };
        })
      );

      setDiscoveredSections(updatedSections);

      // Przeładuj pytania z nowym stylem krawędzi
      const discoveredIds = new Set(discoveredSections.map((s) => s.nodeId));
      await loadQuestions(discoveredIds);
    };

    // Nie wykonuj przy pierwszym renderze (discoveredSections jest puste)
    if (discoveredSections.length > 0) {
      reloadStylizations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleStyle, edgeStyle]);

  // Odkryj nową sekcję po kliknięciu pytania
  const discoverSection = async (targetNodeId: string) => {
    const targetNode = nodeMap.get(targetNodeId);
    if (!targetNode) return;

    setLoadingQuestion(targetNodeId);

    const article = await getNodeStylization(targetNodeId, articleStyle);
    const newSection: DiscoveredSection = {
      nodeId: targetNodeId,
      article,
      node: targetNode,
    };

    const newDiscovered = [...discoveredSections, newSection];
    setDiscoveredSections(newDiscovered);

    // Załaduj nowe pytania ze wszystkich pozostałych nieodkrytych węzłów
    const discoveredIds = new Set(newDiscovered.map((s) => s.nodeId));
    await loadQuestions(discoveredIds);

    setLoadingQuestion(null);

    // Scroll do nowej sekcji
    setTimeout(() => {
      document.getElementById(`section-${targetNodeId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Pobierz zdjęcie z attachmentów root node
  const getImage = () => {
    const attachment = rootNode?.attachments?.find((a) => a.type === "image");
    const url = attachment?.url;
    if (!url || url.includes("example.com")) return null;
    return url;
  };

  const imageUrl = getImage();

  // Czy odkryliśmy wszystkie węzły?
  const allDiscovered = discoveredSections.length === nodes.length;

  // Prepare questions for ExplorationQuestions component
  const preparedQuestions = currentQuestions.map(q => ({
    id: q.edge.to,
    teaser: q.stylizedEdge.teaser,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 flex flex-col">
      {/* Główna treść - ciągły artykuł */}
      <main className="flex-1">
        {isLoading ? (
          <div className="container mx-auto px-4 py-8 max-w-3xl flex items-center justify-center py-20">
            <div className="animate-pulse text-stone-400">Ładowanie...</div>
          </div>
        ) : (
          <article className="space-y-0">
            {/* Hero with image - larger on mobile with ornaments */}
            {imageUrl && (
              <div className="mb-8 sm:mb-6">
                {/* Mobile: larger image with ornaments */}
                <div className="sm:hidden relative w-full h-[50vh] overflow-hidden mb-4">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 z-10" />
                  
                  {/* Image container */}
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={discoveredSections[0]?.article?.title || rootNode?.title || ""}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="100vw"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />
                  </div>
                  
                  {/* Decorative bottom border with ornament */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 w-full px-4">
                      <div className="flex-1 h-px bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="flex-1 h-px bg-amber-400" />
                    </div>
                  </div>
                </div>
                
                {/* Desktop: original styling */}
                <div className="hidden sm:block container mx-auto px-4 max-w-3xl">
                  <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl mt-8">
                    <Image
                      src={imageUrl}
                      alt={discoveredSections[0]?.article?.title || rootNode?.title || ""}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="container mx-auto px-4 py-8 max-w-3xl">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 leading-tight mb-8">
                {discoveredSections[0]?.article?.title || rootNode?.title || ""}
              </h1>

            {/* Odkryte sekcje - ciągły artykuł */}
            <div className="prose prose-stone prose-lg max-w-none">
              {discoveredSections.map((section, index) => {
                const text = section.article?.text || section.node.text;
                const isFirst = index === 0;
                const imageAttachment = section.node.attachments?.find(a => a.type === "image");
                const sectionImageUrl = imageAttachment?.url && !imageAttachment.url.includes("example.com") 
                  ? imageAttachment.url 
                  : undefined;
                
                return (
                  <ArticleSection
                    key={section.nodeId}
                    nodeId={section.nodeId}
                    title={section.article?.title || section.node.title}
                    text={text}
                    imageUrl={sectionImageUrl}
                    imageDescription={imageAttachment?.description}
                    isFirst={isFirst}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Pytania - "baton" do dalszej eksploracji */}
            <ExplorationQuestions
              questions={preparedQuestions}
              onSelectQuestion={discoverSection}
              loadingQuestionId={loadingQuestion}
            />

            {/* Koniec artykułu - wszystko odkryte */}
            {allDiscovered && (
              <div className="mt-12 pt-8 border-t border-stone-200 text-center">
                <p className="text-stone-500 italic">
                  ✨ Odkryłeś cały artykuł!
                </p>
              </div>
            )}

            {/* Zobacz również - inne miejsca */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Zobacz również</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getRelatedPlaces(objectId).map((place) => (
                  <Link
                    key={place.id}
                    href={`/${place.id}/explore`}
                    className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                        {place.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">{place.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Button to view graph */}
            <div className="mt-12 pt-8 border-t border-stone-200 flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href={`/${objectId}/graph`}>
                  Zobacz graf wiedzy
                </Link>
              </Button>
            </div>
            </div>
          </article>
        )}
      </main>

      {/* Stopka z ustawieniami stylu */}
      <footer className="border-t border-stone-200 bg-stone-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <StyleSettings
            articleStyle={articleStyle}
            edgeStyle={edgeStyle}
            onArticleStyleChange={(style) => updateConfig({ articleStyle: style })}
            onEdgeStyleChange={(style) => updateConfig({ edgeStyle: style })}
          />
        </div>
      </footer>

      {/* Pływający odtwarzacz audio */}
      <FloatingAudioPlayer />
    </div>
  );
}
