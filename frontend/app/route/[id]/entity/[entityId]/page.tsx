"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExploreView } from "@/components/ExploreView";
import { BreadcrumbProvider, routeEntityBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  getRoute,
  getEntity,
  getEntitySections,
  getMediaList,
  getEntities,
} from "@/lib/api/pilot";
import type { Entity, Section, Media } from "@/model/pilot/types";
import type { ContentStyle } from "@/lib/sectionDisplay";

const VALID_STYLES: ContentStyle[] = ["default", "children", "casual"];

function orderedPoints(entityIds: string[], entities: Entity[]): Entity[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const result: Entity[] = [];
  for (const routeId of entityIds) {
    const entity = byId.get(routeId);
    if (entity) result.push(entity);
  }
  return result;
}

export default function RouteEntityPage() {
  const params = useParams<{ id: string; entityId: string }>();
  const searchParams = useSearchParams();

  const routeId = params.id;
  const entityId = params.entityId;

  const styleParam = searchParams.get("style") ?? undefined;
  const contentStyle: ContentStyle = VALID_STYLES.includes(styleParam as ContentStyle)
    ? (styleParam as ContentStyle)
    : "default";

  const [routeName, setRouteName] = useState<string>("");
  const [entity, setEntity] = useState<Entity | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [prevEntity, setPrevEntity] = useState<Entity | undefined>(undefined);
  const [nextEntity, setNextEntity] = useState<Entity | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!routeId || !entityId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const [route, entityRes, sectionsRes] = await Promise.all([
          getRoute(routeId),
          getEntity(entityId),
          getEntitySections(entityId),
        ]);
        if (cancelled) return;

        const [allEntities, allMedia] = await Promise.all([
          getEntities(),
          getMediaList(),
        ]);
        if (cancelled) return;

        const points = orderedPoints(route.entityIds, allEntities);
        const currentIndex = points.findIndex((e) => e.id === entityId);
        if (currentIndex === -1) {
          setNotFound(true);
          return;
        }

        const prev = currentIndex > 0 ? points[currentIndex - 1] : undefined;
        const next =
          currentIndex < points.length - 1 ? points[currentIndex + 1] : undefined;

        const mediaById: Record<string, Media> = Object.fromEntries(
          allMedia.map((m) => [m.id, m])
        );

        setRouteName(route.name);
        setEntity(entityRes);
        setSections(sectionsRes);
        setMediaMap(mediaById);
        setPrevEntity(prev);
        setNextEntity(next);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load route entity page", err);

        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("not found")
        ) {
          setNotFound(true);
        } else {
          setError("Nie udało się załadować punktu ścieżki.");
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
  }, [routeId, entityId]);

  if (!routeId || !entityId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Brak identyfikatorów ścieżki lub miejsca.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Ładowanie punktu ścieżki...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Nie znaleziono takiego punktu ścieżki.</p>
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

  if (!entity) return null;

  return (
    <BreadcrumbProvider
      value={routeEntityBreadcrumb(routeId, routeName, entity.name)}
    >
      <ExploreView
        entity={entity}
        sections={sections}
        mediaMap={mediaMap}
        relatedPlaces={[]}
        contentStyle={contentStyle}
        routeContext={{
          routeId,
          routeName,
          prevEntity,
          nextEntity,
        }}
      />
    </BreadcrumbProvider>
  );
}
