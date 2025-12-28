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
  ArticleStyle,
  EdgeStyle,
} from "@/lib/loadStylizations";

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

export function ExploreView({ nodes, edges, rootNodeId, objectId }: ExploreViewProps) {
  // Ładowanie stylów z localStorage (tylko przy mount)
  const [articleStyle, setArticleStyle] = useState<ArticleStyle>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("articleStyle");
      return (saved as ArticleStyle) || "adult";
    }
    return "adult";
  });
  
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edgeStyle");
      return (saved as EdgeStyle) || "informative";
    }
    return "informative";
  });
  
  // Odkryte sekcje - budujemy artykuł stopniowo (lokalny stan - resetuje się przy refresh)
  const [discoveredSections, setDiscoveredSections] = useState<DiscoveredSection[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const rootNode = nodeMap.get(rootNodeId);

  // Zapisz style do localStorage przy zmianie
  useEffect(() => {
    localStorage.setItem("articleStyle", articleStyle);
  }, [articleStyle]);

  useEffect(() => {
    localStorage.setItem("edgeStyle", edgeStyle);
  }, [edgeStyle]);

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
            onArticleStyleChange={setArticleStyle}
            onEdgeStyleChange={setEdgeStyle}
          />
        </div>
      </footer>

      {/* Pływający odtwarzacz audio */}
      <FloatingAudioPlayer />
    </div>
  );
}
