"use client";

import { Play, Pause } from "lucide-react";
import { useArticleReader } from "@/contexts/ArticleReaderContext";

export function FloatingAudioPlayer() {
  const { isPlaying, sentences, start, stop } = useArticleReader();
  const hasContent = sentences.length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => (isPlaying ? stop() : start())}
        disabled={!hasContent}
        className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none"
        aria-label={isPlaying ? "Zatrzymaj czytanie" : "Odtwórz czytanie artykułu"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" fill="currentColor" />
        ) : (
          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
        )}
      </button>
    </div>
  );
}
