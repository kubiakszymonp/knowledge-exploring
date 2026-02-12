import { notFound } from "next/navigation";
import { ExploreView } from "@/components/ExploreView";
import {
  getEntity,
  getEntitySections,
  getMediaList,
  getEntities,
} from "@/lib/api/pilot";
import type { Entity, Section, Media } from "@/model/pilot/types";
import type { ContentStyle } from "@/lib/sectionDisplay";

const VALID_STYLES: ContentStyle[] = ["default", "children", "casual"];

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EntityPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const styleParam = typeof sp?.style === "string" ? sp.style : undefined;
  const contentStyle: ContentStyle = VALID_STYLES.includes(styleParam as ContentStyle)
    ? (styleParam as ContentStyle)
    : "default";

  let entity: Entity;
  let sections: Section[];
  try {
    [entity, sections] = await Promise.all([
      getEntity(id),
      getEntitySections(id),
    ]);
  } catch {
    notFound();
  }

  const allMedia = await getMediaList();
  const mediaMap: Record<string, Media> = Object.fromEntries(
    allMedia.map((m) => [m.id, m])
  );

  const allEntities = await getEntities();
  const relatedPlaces =
    entity.relatedEntityIds?.length > 0
      ? entity.relatedEntityIds
          .map((eid) => allEntities.find((e) => e.id === eid))
          .filter((e): e is Entity => e != null && e.type === "place")
      : allEntities.filter(
          (e) => e.type === "place" && e.id !== id
        );

  return (
    <ExploreView
      entity={entity}
      sections={sections}
      mediaMap={mediaMap}
      relatedPlaces={relatedPlaces}
      contentStyle={contentStyle}
    />
  );
}
