"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { ArticleSection } from "@/components/ArticleSection";
import { AppHeader } from "@/components/AppHeader";
import { ArticleReaderProvider } from "@/contexts/ArticleReaderContext";
import { FloatingAudioPlayer } from "@/components/FloatingAudioPlayer";
import type { Entity, Section, Media } from "@/model/pilot/types";

export interface RouteContext {
  routeId: string;
  routeName: string;
  prevEntity?: Entity;
  nextEntity?: Entity;
}

interface ExploreViewProps {
  entity: Entity;
  sections: Section[];
  mediaMap: Record<string, Media>;
  relatedPlaces: Entity[];
  routeContext?: RouteContext;
}

export function ExploreView({
  entity,
  sections,
  mediaMap,
  relatedPlaces,
  routeContext,
}: ExploreViewProps) {
  const readerSections = useMemo(
    () => sections.map((s) => ({ nodeId: s.id, text: s.content })),
    [sections]
  );

  const heroImageUrl = useMemo(() => {
    const firstSection = sections[0];
    if (!firstSection?.mediaIds?.length) return null;
    const media = mediaMap[firstSection.mediaIds[0]];
    return media?.storageUrl ?? null;
  }, [sections, mediaMap]);

  const displayTitle = sections[0]?.title ?? entity.name;
  const relatedToShow = relatedPlaces.slice(0, 6);
  const showRouteNav = routeContext && (routeContext.prevEntity || routeContext.nextEntity);
  const showRelated = !routeContext && relatedToShow.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 flex flex-col">
      <AppHeader backHref="/" backBehavior="history" title={displayTitle} />

      <ArticleReaderProvider sections={readerSections}>
        <main className="flex-1 pt-4 sm:pt-6">
          <article className="space-y-0">
            {heroImageUrl && (
              <div className="mb-8 sm:mb-6">
                <div className="sm:hidden relative w-full h-[50vh] overflow-hidden mb-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={heroImageUrl}
                      alt={displayTitle}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="100vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 w-full px-4">
                      <div className="flex-1 h-px bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="flex-1 h-px bg-amber-400" />
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block container mx-auto px-4 max-w-3xl">
                  <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl mt-8">
                    <Image
                      src={heroImageUrl}
                      alt={displayTitle}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent" />
                  </div>
                </div>
              </div>
            )}

            <div className="container mx-auto px-4 py-8 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 leading-tight mb-8">
                {displayTitle}
              </h1>

              <div className="prose prose-stone prose-lg max-w-none">
                {sections.map((section, index) => {
                  const firstMediaId = section.mediaIds?.[0];
                  const media = firstMediaId
                    ? mediaMap[firstMediaId]
                    : undefined;
                  const sectionImageUrl = media?.storageUrl;
                  const isFirst = index === 0;

                  return (
                    <ArticleSection
                      key={section.id}
                      nodeId={section.id}
                      title={section.title}
                      text={section.content}
                      imageUrl={sectionImageUrl}
                      imageDescription={media?.description}
                      isFirst={isFirst}
                      index={index}
                    />
                  );
                })}
              </div>

              {showRouteNav && routeContext && (
                <div className="mt-12 pt-8 border-t border-stone-200">
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
                    Na ścieżce: {routeContext.routeName}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {routeContext.prevEntity && (
                      <Link
                        href={`/route/${routeContext.routeId}/entity/${routeContext.prevEntity.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow px-5 py-4 border border-stone-100"
                      >
                        <span className="text-stone-400">←</span>
                        <span className="font-semibold text-stone-800 group-hover:text-amber-700">
                          Poprzedni: {routeContext.prevEntity.name}
                        </span>
                      </Link>
                    )}
                    {routeContext.nextEntity && (
                      <Link
                        href={`/route/${routeContext.routeId}/entity/${routeContext.nextEntity.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow px-5 py-4 border border-stone-100"
                      >
                        <span className="font-semibold text-stone-800 group-hover:text-amber-700">
                          Następny: {routeContext.nextEntity.name}
                        </span>
                        <span className="text-stone-400">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {showRelated && (
                <div className="mt-12 pt-8 border-t border-stone-200">
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
                    Zobacz również
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedToShow.map((place) => (
                      <Link
                        key={place.id}
                        href={`/entity/${place.id}`}
                        className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-[3/2]">
                          <Image
                            src={`https://picsum.photos/seed/${place.id}/600/400`}
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </main>

        <footer className="border-t border-stone-200 bg-stone-50/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 max-w-3xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/places"
                className="text-[11px] sm:text-xs text-stone-300 hover:text-amber-500 hover:underline underline-offset-4 transition-colors text-right"
              >
                wszystkie miejsca
              </Link>
            </div>
          </div>
        </footer>

        <FloatingAudioPlayer />
      </ArticleReaderProvider>
    </div>
  );
}
