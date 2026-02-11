"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  splitParagraphsIntoSentences,
  flattenSentences,
} from "@/lib/articleReaderUtils";

export interface ArticleReaderSection {
  nodeId: string;
  text: string;
}

export interface SectionReaderData {
  paragraphsSentences: string[][];
  startSentenceIndex: number;
}

interface ArticleReaderContextValue {
  isPlaying: boolean;
  sentences: string[];
  currentIndex: number;
  start: () => void;
  stop: () => void;
  playFrom: (index: number) => void;
  getSectionReaderData: (nodeId: string) => SectionReaderData | null;
}

const ArticleReaderContext = createContext<ArticleReaderContextValue | null>(null);

const LOG_PREFIX = "[ArticleReader]";

function log(event: string, payload?: Record<string, unknown>) {
  const timestamp = new Date().toISOString().slice(11, 23);
  if (payload !== undefined) {
    console.log(`${LOG_PREFIX} ${timestamp} ${event}`, payload);
  } else {
    console.log(`${LOG_PREFIX} ${timestamp} ${event}`);
  }
}

function buildSectionData(
  sections: ArticleReaderSection[]
): {
  sentences: string[];
  sectionDataMap: Map<string, SectionReaderData>;
} {
  const sentences: string[] = [];
  const sectionDataMap = new Map<string, SectionReaderData>();

  for (const section of sections) {
    const paragraphsSentences = splitParagraphsIntoSentences(section.text);
    const startSentenceIndex = sentences.length;
    const flat = flattenSentences(paragraphsSentences);
    for (const s of flat) sentences.push(s);
    sectionDataMap.set(section.nodeId, { paragraphsSentences, startSentenceIndex });
  }

  return { sentences, sectionDataMap };
}

interface ArticleReaderProviderProps {
  sections: ArticleReaderSection[];
  children: ReactNode;
}

export function ArticleReaderProvider({ sections, children }: ArticleReaderProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionDataRef = useRef<Map<string, SectionReaderData>>(new Map());

  const { sentences, sectionDataMap } = useMemo(() => buildSectionData(sections), [sections]);
  sectionDataRef.current = sectionDataMap;
  const sentencesRef = useRef<string[]>(sentences);
  sentencesRef.current = sentences;

  const prevSectionsRef = useRef(sections);
  useEffect(() => {
    if (prevSectionsRef.current !== sections) {
      const prev = prevSectionsRef.current;
      prevSectionsRef.current = sections;
      log("sections_updated", {
        prevCount: prev.length,
        nextCount: sections.length,
        nodeIds: sections.map((s) => s.nodeId),
      });
    }
  }, [sections]);

  const getSectionReaderData = useCallback((nodeId: string): SectionReaderData | null => {
    return sectionDataRef.current.get(nodeId) ?? null;
  }, []);

  const stop = useCallback(() => {
    log("stop", { currentIndex });
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (currentIndex >= sentences.length) {
      log("start_skipped", { currentIndex, totalSentences: sentences.length });
      return;
    }
    log("start", { currentIndex, totalSentences: sentences.length });
    setIsPlaying(true);
  }, [currentIndex, sentences.length]);

  const playFrom = useCallback((index: number) => {
    log("play_from", { index, totalSentences: sentencesRef.current.length });
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isPlaying) return;
    const list = sentencesRef.current;
    if (currentIndex >= list.length) return;
    const text = list[currentIndex];
    log("sentence_start", { index: currentIndex, total: list.length, preview: text.slice(0, 50) });
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.onend = () => {
      log("sentence_end", { index: currentIndex, nextIndex: currentIndex + 1 });
      setCurrentIndex((prev) => prev + 1);
    };
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentIndex, sentences]);

  const value = useMemo(
    () => ({
      isPlaying,
      sentences,
      currentIndex,
      start,
      stop,
      playFrom,
      getSectionReaderData,
    }),
    [
      isPlaying,
      sentences,
      currentIndex,
      start,
      stop,
      playFrom,
      getSectionReaderData,
    ]
  );

  return (
    <ArticleReaderContext.Provider value={value}>
      {children}
    </ArticleReaderContext.Provider>
  );
}

export function useArticleReader(): ArticleReaderContextValue {
  const ctx = useContext(ArticleReaderContext);
  if (!ctx) throw new Error("useArticleReader must be used within ArticleReaderProvider");
  return ctx;
}
