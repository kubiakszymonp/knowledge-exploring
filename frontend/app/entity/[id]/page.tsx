"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExploreView } from "@/components/ExploreView";
import { BreadcrumbProvider, entityBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  getEntity,
  getEntitySections,
  getMediaList,
  getEntities,
} from "@/lib/api/pilot";
import type { Entity, Section, Media } from "@/model/pilot/types";
import type { ContentStyle } from "@/lib/sectionDisplay";

const VALID_STYLES: ContentStyle[] = ["default", "children", "casual"];

export default function EntityPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id;

  const styleParam = searchParams.get("style") ?? undefined;
  const contentStyle: ContentStyle = VALID_STYLES.includes(styleParam as ContentStyle)
    ? (styleParam as ContentStyle)
    : "default";

  const [entity, setEntity] = useState<Entity | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [relatedPlaces, setRelatedPlaces] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const [entityRes, sectionsRes] = await Promise.all([
          getEntity(id),
          getEntitySections(id),
        ]);
        if (cancelled) return;

        const [allMedia, allEntities] = await Promise.all([
          getMediaList(),
          getEntities(),
        ]);
        if (cancelled) return;

        const mediaById: Record<string, Media> = Object.fromEntries(
          allMedia.map((m) => [m.id, m])
        );

        const relatedEntityIds = entityRes.relatedEntityIds ?? [];
        const related =
          relatedEntityIds.length > 0
            ? relatedEntityIds
                .map((eid) => allEntities.find((e) => e.id === eid))
                .filter((e): e is Entity => e != null && e.type === "place")
            : allEntities.filter(
                (e) => e.type === "place" && e.id !== id
              );

        setEntity(entityRes);
        setSections(sectionsRes);
        setMediaMap(mediaById);
        setRelatedPlaces(related);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load entity page", err);

        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("not found")
        ) {
          setNotFound(true);
        } else {
          setError("Nie udało się załadować strony miejsca.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Brak identyfikatora miejsca.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Ładowanie miejsca...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Nie znaleziono takiego miejsca.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!entity) {
    return null;
  }

  return (
    <BreadcrumbProvider value={entityBreadcrumb(entity)}>
      <ExploreView
        entity={entity}
        sections={sections}
        mediaMap={mediaMap}
        relatedPlaces={relatedPlaces}
        contentStyle={contentStyle}
      />
    </BreadcrumbProvider>
  );
}
