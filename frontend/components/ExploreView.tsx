"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StyleSettings } from "@/components/StyleSettings";
import { SectionImage } from "@/components/SectionImage";
import {
  getNodeStylization,
  getEdgeStylization,
  StylizedArticle,
  StylizedEdge,
  ArticleStyle,
  EdgeStyle,
} from "@/lib/loadStylizations";
import { ChevronDown } from "lucide-react";

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

export function ExploreView({ nodes, edges, rootNodeId }: ExploreViewProps) {
  const [articleStyle, setArticleStyle] = useState<ArticleStyle>("adult");
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>("informative");
  
  // Odkryte sekcje - budujemy artykuł stopniowo
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

  // Inicjalizacja - załaduj root
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
  }, [rootNodeId, rootNode, articleStyle, loadQuestions]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 flex flex-col">
      {/* Główna treść - ciągły artykuł */}
      <main className="container mx-auto px-4 py-8 max-w-3xl flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-stone-400">Ładowanie...</div>
          </div>
        ) : (
          <article className="space-y-0">
            {/* Zdjęcie główne */}
            {imageUrl && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={imageUrl}
                  alt={rootNode?.title || ""}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Główny tytuł */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-800 leading-tight">
                {discoveredSections[0]?.article?.title || rootNode?.title}
              </h1>
              {rootNode?.tags && rootNode.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {rootNode.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="border-amber-300 text-amber-700 bg-amber-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Odkryte sekcje - ciągły artykuł */}
            <div className="prose prose-stone prose-lg max-w-none">
              {discoveredSections.map((section, index) => {
                const text = section.article?.text || section.node.text;
                const isFirst = index === 0;
                const imageAttachment = section.node.attachments?.find(a => a.type === "image");
                const imageUrl = imageAttachment?.url && !imageAttachment.url.includes("example.com") 
                  ? imageAttachment.url 
                  : null;
                
                return (
                  <section
                    key={section.nodeId}
                    id={`section-${section.nodeId}`}
                    className={`${!isFirst ? "pt-6" : ""} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  >
                    {/* Podtytuł dla sekcji (nie dla root) */}
                    {!isFirst && (
                      <h2 className="text-2xl font-serif font-semibold text-stone-700 mb-4 flex items-center gap-2">
                        <span className="w-8 h-px bg-amber-400" />
                        {section.article?.title || section.node.title}
                      </h2>
                    )}
                    
                    {/* Obraz sekcji (jeśli istnieje i nie jest pierwszą sekcją) */}
                    {!isFirst && imageUrl && (
                      <SectionImage
                        url={imageUrl}
                        description={imageAttachment?.description}
                        position={index % 2 === 0 ? "right" : "left"}
                      />
                    )}
                    
                    {/* Treść sekcji */}
                    {text.split("\n\n").map((paragraph, i) => (
                      <p 
                        key={i} 
                        className="text-stone-700 leading-relaxed mb-4 text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </section>
                );
              })}
            </div>

            {/* Pytania - "baton" do dalszej eksploracji */}
            {currentQuestions.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-6">
                  <ChevronDown className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                    Czytaj dalej
                  </span>
                </div>

                <div className="space-y-3">
                  {currentQuestions.map((q) => (
                    <button
                      key={q.edge.to}
                      onClick={() => discoverSection(q.edge.to)}
                      disabled={loadingQuestion !== null}
                      className="w-full text-left p-4 rounded-lg bg-white border border-stone-200 
                                 hover:border-amber-400 hover:bg-amber-50/50 
                                 transition-all duration-200 group
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-lg text-stone-700 group-hover:text-amber-700 transition-colors">
                        {q.stylizedEdge.teaser}
                      </span>
                      {loadingQuestion === q.edge.to && (
                        <span className="ml-2 text-amber-500 animate-pulse">...</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Koniec artykułu - wszystko odkryte */}
            {allDiscovered && (
              <div className="mt-12 pt-8 border-t border-stone-200 text-center">
                <p className="text-stone-500 italic">
                  ✨ Odkryłeś cały artykuł!
                </p>
              </div>
            )}
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
    </div>
  );
}
