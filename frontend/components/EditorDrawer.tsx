"use client";

import { useState, useEffect } from "react";
import { KnowledgeNode } from "../model/KnowledgeNode";
import { Edge } from "../model/Edge";
import { KnowledgeGraph } from "../model/KnowledgeGraph";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  getNodeStylizations,
  getEdgeStylizations,
} from "@/lib/loadStylizations";

interface EditorDrawerProps {
  selected:
    | { type: "node"; data: KnowledgeNode }
    | { type: "edge"; data: Edge }
    | null;
  onClose: () => void;
  graph: KnowledgeGraph;
}

interface StylizedArticle {
  nodeId: string;
  style: string;
  title: string;
  text: string;
}

interface StylizedEdge {
  from: string;
  to: string;
  style: string;
  teaser: string;
}

const STYLE_LABELS: Record<string, string> = {
  adult: "🎓 Dorosły",
  kids: "🧒 Dla dzieci",
  funny: "😄 Zabawny",
  vulgar: "🤬 Wulgarny",
  storytelling: "🎧 Storytelling",
  informative: "📋 Informacyjna",
  clickbait: "🔥 Clickbait",
  shocking: "😱 Szokująca",
  mysterious: "🔮 Tajemnicza",
};

function NodeEditorContent({ node }: { node: KnowledgeNode }) {
  const [editedText, setEditedText] = useState(node.text);
  const [stylizations, setStylizations] = useState<StylizedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStylizations() {
      setLoading(true);
      const data = await getNodeStylizations(node.id);
      setStylizations(data);
      setLoading(false);
    }
    loadStylizations();
  }, [node.id]);

  return (
    <div className="space-y-8 px-2">
      {/* Oryginalny artykuł - EDYTOWALNY */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Treść oryginalna (edytowalna)
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Tytuł</p>
            <p className="text-lg font-semibold">{node.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Opis</p>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[200px] font-sans text-sm leading-relaxed"
              placeholder="Wprowadź opis..."
            />
          </div>
        </div>
      </section>

      {/* Tagi */}
      {node.tags.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Tagi
          </h3>
          <div className="flex flex-wrap gap-2">
            {node.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <Separator className="my-6" />

      {/* Stylizacje */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Wersje stylizowane {loading && <span className="text-xs">(ładowanie...)</span>}
        </h3>
        {stylizations.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {stylizations.map((stylization, index) => (
              <AccordionItem
                key={index}
                value={`style-${index}`}
                className="border border-border rounded-xl px-4 overflow-hidden"
              >
                <AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
                  {STYLE_LABELS[stylization.style] || stylization.style}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                    <h4 className="font-semibold text-foreground">
                      {stylization.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stylization.text}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          !loading && (
            <p className="text-sm text-muted-foreground">
              Brak wygenerowanych stylizacji. Uruchom skrypt stylizacji.
            </p>
          )
        )}
      </section>

      {/* Załączniki */}
      {node.attachments.length > 0 && (
        <>
          <Separator className="my-6" />
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Załączniki ({node.attachments.length})
            </h3>
            <div className="grid gap-3">
              {node.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {att.type === "image"
                      ? "🖼️"
                      : att.type === "video"
                      ? "🎬"
                      : att.type === "audio"
                      ? "🎵"
                      : att.type === "map"
                      ? "🗺️"
                      : "📄"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {att.description || att.id}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {att.url}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {att.type}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function EdgeEditorContent({ edge, graph }: { edge: Edge; graph: KnowledgeGraph }) {
  const [stylizations, setStylizations] = useState<StylizedEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const sourceNode = graph.getNode(edge.from);
  const targetNode = graph.getNode(edge.to);

  useEffect(() => {
    async function loadStylizations() {
      setLoading(true);
      const data = await getEdgeStylizations(edge.from, edge.to);
      setStylizations(data);
      setLoading(false);
    }
    loadStylizations();
  }, [edge.from, edge.to]);

  return (
    <div className="space-y-8 px-2">
      {/* Połączenie */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Połączenie
        </h3>
        <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1.5">Źródło</p>
            <p className="font-semibold text-sm">{sourceNode?.title || edge.from}</p>
          </div>
          <div className="text-3xl text-muted-foreground/50">→</div>
          <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1.5">Cel</p>
            <p className="font-semibold text-sm">{targetNode?.title || edge.to}</p>
          </div>
        </div>
      </section>

      {/* Oryginalna etykieta */}
      {edge.label && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Oryginalna etykieta
          </h3>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-medium">{edge.label}</p>
          </div>
        </section>
      )}

      <Separator className="my-6" />

      {/* Stylizacje zajawek */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Stylizowane zajawki {loading && <span className="text-xs">(ładowanie...)</span>}
        </h3>
        {stylizations.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {stylizations.map((stylization, index) => (
              <AccordionItem
                key={index}
                value={`style-${index}`}
                className="border border-border rounded-xl px-4 overflow-hidden"
              >
                <AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
                  {STYLE_LABELS[stylization.style] || stylization.style}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-muted/50 rounded-lg p-5">
                    <p className="text-sm font-medium leading-relaxed">
                      {stylization.teaser}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          !loading && (
            <p className="text-sm text-muted-foreground">
              Brak wygenerowanych zajawek. Uruchom skrypt stylizacji krawędzi.
            </p>
          )
        )}
      </section>
    </div>
  );
}

export default function EditorDrawer({ selected, onClose, graph }: EditorDrawerProps) {
  const isOpen = selected !== null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[75vh] rounded-t-2xl border-t-2 border-border"
      >
        <SheetHeader className="px-6 pt-2 pb-6 border-b border-border">
          <SheetTitle className="text-left">
            {selected?.type === "node" && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30" />
                <span className="text-xl font-semibold">
                  {selected.data.title}
                </span>
              </div>
            )}
            {selected?.type === "edge" && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
                <span className="text-xl font-semibold">
                  Krawędź
                </span>
                <span className="text-muted-foreground font-normal text-base ml-1">
                  {graph.getNode(selected.data.from)?.title || selected.data.from} → {graph.getNode(selected.data.to)?.title || selected.data.to}
                </span>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(75vh-120px)] py-6 px-4">
          {selected?.type === "node" && (
            <NodeEditorContent node={selected.data} />
          )}
          {selected?.type === "edge" && (
            <EdgeEditorContent edge={selected.data} graph={graph} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
