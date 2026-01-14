import { SectionImage } from "./SectionImage";

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
      
      {/* Section content */}
      {paragraphs.map((paragraph, i) => (
        <p 
          key={i} 
          className="text-stone-700 leading-relaxed mb-4 text-lg"
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}





