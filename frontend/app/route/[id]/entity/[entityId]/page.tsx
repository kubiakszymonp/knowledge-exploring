import { notFound } from "next/navigation";
import { ExploreView } from "@/components/ExploreView";
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

interface PageProps {
  params: Promise<{ id: string; entityId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function orderedPoints(entityIds: string[], entities: Entity[]): Entity[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const result: Entity[] = [];
  for (const routeId of entityIds) {
    const entity = byId.get(routeId);
    if (entity) result.push(entity);
  }
  return result;
}

export default async function RouteEntityPage({ params, searchParams }: PageProps) {
  const { id: routeId, entityId } = await params;
  const sp = await searchParams;
  const styleParam = typeof sp?.style === "string" ? sp.style : undefined;
  const contentStyle: ContentStyle = VALID_STYLES.includes(styleParam as ContentStyle)
    ? (styleParam as ContentStyle)
    : "default";

  let route;
  let entity: Entity;
  let sections: Section[];
  try {
    [route, entity, sections] = await Promise.all([
      getRoute(routeId),
      getEntity(entityId),
      getEntitySections(entityId),
    ]);
  } catch {
    notFound();
  }

  const entities = await getEntities();
  const points = orderedPoints(route.entityIds, entities);
  const currentIndex = points.findIndex((e) => e.id === entityId);
  if (currentIndex === -1) notFound();

  const prevEntity = currentIndex > 0 ? points[currentIndex - 1] : undefined;
  const nextEntity =
    currentIndex < points.length - 1 ? points[currentIndex + 1] : undefined;

  const allMedia = await getMediaList();
  const mediaMap: Record<string, Media> = Object.fromEntries(
    allMedia.map((m) => [m.id, m])
  );

  const relatedPlaces =
    entity.relatedEntityIds?.length > 0
      ? entity.relatedEntityIds
          .map((eid) => entities.find((e) => e.id === eid))
          .filter((e): e is Entity => e != null && e.type === "place")
      : [];

  return (
    <ExploreView
      entity={entity}
      sections={sections}
      mediaMap={mediaMap}
      relatedPlaces={relatedPlaces}
      contentStyle={contentStyle}
      routeContext={{
        routeId,
        routeName: route.name,
        prevEntity,
        nextEntity,
      }}
    />
  );
}
