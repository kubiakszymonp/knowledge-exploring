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

interface PageProps {
  params: Promise<{ id: string; entityId: string }>;
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

export default async function RouteEntityPage({ params }: PageProps) {
  const { id: routeId, entityId } = await params;

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

  return (
    <ExploreView
      entity={entity}
      sections={sections}
      mediaMap={mediaMap}
      relatedPlaces={[]}
      routeContext={{
        routeId,
        routeName: route.name,
        prevEntity,
        nextEntity,
      }}
    />
  );
}
