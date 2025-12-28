"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

export function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
        aria-label={isPlaying ? "Pause" : "Play"}
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

