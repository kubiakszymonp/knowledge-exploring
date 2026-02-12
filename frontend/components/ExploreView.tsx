"use client";

import { useMemo, useState, useCallback } from "react";
import { ArticleSection } from "@/components/ArticleSection";
import { AppHeader } from "@/components/AppHeader";
import { ArticleReaderProvider } from "@/contexts/ArticleReaderContext";
import { FloatingAudioPlayer } from "@/components/FloatingAudioPlayer";
import { ExplorationQuestions } from "@/components/ExplorationQuestions";
import { ExploreHeroImage } from "@/components/ExploreHeroImage";
import { RouteNavigation } from "@/components/RouteNavigation";
import { RelatedPlaces } from "@/components/RelatedPlaces";
import { ExploreFooter } from "@/components/ExploreFooter";
import type { Entity, Section, Media } from "@/model/pilot/types";
import type { RouteContext } from "@/model/pilot/types";
import type { ContentStyle } from "@/lib/sectionDisplay";
import { useExploreSections } from "@/lib/explore/useExploreSections";
import type { ResolvedSectionWithVisibility } from "@/lib/explore/useExploreSections";

export type { RouteContext };

interface ExploreViewProps {
  entity: Entity;
  sections: Section[];
  mediaMap: Record<string, Media>;
  relatedPlaces: Entity[];
  routeContext?: RouteContext;
  contentStyle?: ContentStyle;
}

function isDisplayed(
  item: ResolvedSectionWithVisibility,
  expandedSectionIds: string[]
): boolean {
  return !item.hidden || expandedSectionIds.includes(item.section.id);
}

export function ExploreView({
  entity,
  sections,
  mediaMap,
  relatedPlaces,
  routeContext,
  contentStyle = "default",
}: ExploreViewProps) {
  const resolvedSections = useExploreSections(sections, contentStyle);
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);

  const displayedSections = useMemo(
    () => resolvedSections.filter((item) => isDisplayed(item, expandedSectionIds)),
    [resolvedSections, expandedSectionIds]
  );

  const readerSections = useMemo(
    () =>
      resolvedSections
        .filter((item) => isDisplayed(item, expandedSectionIds))
        .map(({ section, content }) => ({ nodeId: section.id, text: content })),
    [resolvedSections, expandedSectionIds]
  );

  const hiddenProposals = useMemo(
    () =>
      resolvedSections.filter(
        (item) => item.hidden && !expandedSectionIds.includes(item.section.id)
      ),
    [resolvedSections, expandedSectionIds]
  );

  const handleExpandSection = useCallback((sectionId: string) => {
    setExpandedSectionIds((prev) =>
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
  }, []);

  const heroImageUrl = useMemo(() => {
    const mainMediaId = entity.mediaIds?.[0];
    if (mainMediaId) {
      const media = mediaMap[mainMediaId];
      if (media?.storageUrl) return media.storageUrl;
    }
    const firstSection = sections[0];
    if (firstSection?.mediaIds?.length) {
      const media = mediaMap[firstSection.mediaIds[0]];
      return media?.storageUrl ?? null;
    }
    return null;
  }, [entity.mediaIds, sections, mediaMap]);

  const displayTitle = resolvedSections[0]?.title ?? entity.name;
  const relatedToShow = relatedPlaces.slice(0, 6);
  const showRouteNav = routeContext && (routeContext.prevEntity || routeContext.nextEntity);
  const showRelated = !routeContext && relatedToShow.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 flex flex-col">
      <AppHeader backHref="/" backBehavior="history" title={displayTitle} />

      <ArticleReaderProvider sections={readerSections}>
        <main className="flex-1">
          <article className="space-y-0">
            {heroImageUrl && (
              <ExploreHeroImage imageUrl={heroImageUrl} alt={displayTitle} />
            )}

            <div className="container mx-auto px-4 pb-8 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 leading-tight mb-8">
                {displayTitle}
              </h1>

              <div className="prose prose-stone prose-lg max-w-none">
                {displayedSections.map(({ section, title, content }, index) => {
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
                      title={title}
                      teaser={section.teaser}
                      text={content}
                      imageUrl={sectionImageUrl}
                      imageDescription={media?.description}
                      isFirst={isFirst}
                      index={index}
                    />
                  );
                })}
              </div>

              {hiddenProposals.length > 0 && (
                <ExplorationQuestions
                  questions={hiddenProposals.slice(0, 3).map(({ section, title }) => ({
                    id: section.id,
                    teaser: section.teaser ?? title,
                  }))}
                  onSelectQuestion={handleExpandSection}
                  loadingQuestionId={null}
                />
              )}

              {showRouteNav && routeContext && (
                <RouteNavigation routeContext={routeContext} />
              )}

              {showRelated && (
                <RelatedPlaces places={relatedToShow} mediaMap={mediaMap} />
              )}
            </div>
          </article>
        </main>

        <ExploreFooter />

        <FloatingAudioPlayer />
      </ArticleReaderProvider>
    </div>
  );
}
