import Image from "next/image";

interface SectionImageProps {
  url: string;
  description?: string;
  position?: "left" | "right" | "full";
}

export function SectionImage({ 
  url, 
  description, 
  position = "right" 
}: SectionImageProps) {
  if (position === "full") {
    return (
      <figure className="my-6 -mx-4 sm:mx-0">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
          <Image
            src={url}
            alt={description || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        {description && (
          <figcaption className="mt-2 text-sm text-stone-500 text-center italic">
            {description}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`
      my-4 
      ${position === "left" ? "float-left mr-4 mb-4" : "float-right ml-4 mb-4"}
      w-full sm:w-64
    `}>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
        <Image
          src={url}
          alt={description || ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 256px"
        />
      </div>
      {description && (
        <figcaption className="mt-1 text-xs text-stone-500 italic">
          {description}
        </figcaption>
      )}
    </figure>
  );
}

