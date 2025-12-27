import Image from "next/image";

interface ArticleHeroProps {
  imageUrl?: string;
  title: string;
}

export function ArticleHero({ imageUrl, title }: ArticleHeroProps) {
  return (
    <header className="mb-8">
      {/* Image with subtle bottom fade */}
      {imageUrl && (
        <div className="relative w-full aspect-[21/9] overflow-hidden mb-6">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Subtle gradient at bottom only - fades to page background */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>
      )}
      
      {/* Title below image - black text */}
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 leading-tight">
        {title}
      </h1>
    </header>
  );
}

