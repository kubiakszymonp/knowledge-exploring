"use client";

import Link from "next/link";
import Image from "next/image";
import type { Entity, Media } from "@/model/pilot/types";

interface RelatedPlacesProps {
  places: Entity[];
  mediaMap: Record<string, Media>;
}

export function RelatedPlaces({ places, mediaMap }: RelatedPlacesProps) {
  if (places.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-stone-200">
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
        Zobacz również
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => {
          const placeImageUrl = place.mediaIds?.[0]
            ? mediaMap[place.mediaIds[0]]?.storageUrl
            : null;
          return (
            <Link
              key={place.id}
              href={`/entity/${place.id}`}
              className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={
                    placeImageUrl ??
                    `https://picsum.photos/seed/${place.id}/600/400`
                  }
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                  {place.name}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  {place.shortDescription ?? ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
