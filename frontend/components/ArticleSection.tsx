"use client";

import { SectionImage } from "./SectionImage";
import { useArticleReader } from "@/contexts/ArticleReaderContext";

interface ArticleSectionProps {
  nodeId: string;
  title?: string;
  text: string;
  imageUrl?: string;
  imageDescription?: string;
  isFirst: boolean;
  index: number;
}

export function ArticleSection({
  nodeId,
  title,
  text,
  imageUrl,
  imageDescription,
  isFirst,
  index,
}: ArticleSectionProps) {
  const { isPlaying, currentIndex, playFrom, getSectionReaderData } = useArticleReader();
  const sectionData = getSectionReaderData(nodeId);
  const paragraphs = text.split("\n\n");

  return (
    <section
      id={`section-${nodeId}`}
      className={`${!isFirst ? "pt-6" : ""} animate-in fade-in slide-in-from-bottom-4 duration-500`}
    >
      {/* Subtitle for sections (not for root) */}
      {!isFirst && title && (
        <h2 className="text-2xl font-serif font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-amber-400" />
          {title}
        </h2>
      )}
      
      {/* Section image (if exists and not first section) */}
      {!isFirst && imageUrl && (
        <SectionImage
          url={imageUrl}
          description={imageDescription}
          position={index % 2 === 0 ? "right" : "left"}
        />
      )}
      
      {/* Section content: sentence spans when reader data exists, else plain paragraphs */}
      {sectionData ? (
        sectionData.paragraphsSentences.map((sentences, pIndex) => (
          <p
            key={pIndex}
            className="text-stone-700 leading-relaxed mb-4 text-lg"
          >
            {sentences.map((sentence, sIndex) => {
              const offsetInSection = sectionData.paragraphsSentences
                .slice(0, pIndex)
                .reduce((acc, arr) => acc + arr.length, 0) + sIndex;
              const globalIdx = sectionData.startSentenceIndex + offsetInSection;
              const isCurrent = isPlaying && currentIndex === globalIdx;
              return (
                <span
                  key={sIndex}
                  role="button"
                  tabIndex={0}
                  data-sentence-index={globalIdx}
                  onClick={() => playFrom(globalIdx)}
                  onKeyDown={(e) => e.key === "Enter" && playFrom(globalIdx)}
                  className={
                    isCurrent
                      ? "bg-amber-200/70 rounded px-0.5 cursor-pointer"
                      : "cursor-pointer hover:bg-amber-100/50 rounded px-0.5"
                  }
                >
                  {sentence}
                  {sIndex < sentences.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        ))
      ) : (
        paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-stone-700 leading-relaxed mb-4 text-lg"
          >
            {paragraph}
          </p>
        ))
      )}
    </section>
  );
}





