"use client";

import Image from "next/image";

interface ExploreHeroImageProps {
  imageUrl: string;
  alt: string;
}

export function ExploreHeroImage({ imageUrl, alt }: ExploreHeroImageProps) {
  return (
    <div className="mb-6 sm:mb-4">
      <div className="sm:hidden relative w-full h-[50vh] overflow-hidden mb-4">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="hidden sm:block container mx-auto px-4 max-w-3xl">
        <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl mt-4">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
