import { notFound } from "next/navigation";
import { ExploreView } from "@/components/ExploreView";
import {
  getEntity,
  getEntitySections,
  getMediaList,
  getEntities,
} from "@/lib/api/pilot";
import type { Entity, Section, Media } from "@/model/pilot/types";

interface PageProps {
  params: Promise<{ objectId: string }>;
}

export default async function ExplorePage({ params }: PageProps) {
  const { objectId } = await params;

  let entity: Entity;
  let sections: Section[];
  try {
    [entity, sections] = await Promise.all([
      getEntity(objectId),
      getEntitySections(objectId),
    ]);
  } catch {
    notFound();
  }

  const allMedia = await getMediaList();
  const mediaMap: Record<string, Media> = Object.fromEntries(
    allMedia.map((m) => [m.id, m])
  );

  const allEntities = await getEntities();
  const relatedPlaces = allEntities.filter(
    (e) => e.type === "place" && e.id !== objectId
  );

  return (
    <ExploreView
      entity={entity}
      sections={sections}
      mediaMap={mediaMap}
      relatedPlaces={relatedPlaces}
    />
  );
}
