/** Entity = place / object / event / person (model pilota) */
export type EntityType = "place" | "event" | "person" | "object";

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  shortDescription?: string;
  geo?: { lat: number; lng: number };
  tags?: string[];
  mediaIds?: string[];
  relatedEntityIds?: string[];
  createdAt: string; // ISO
}

/** Thematic scores 0–100 for future personalization */
export interface ThematicScores {
  history?: number;
  culture?: number;
  curiosity?: number;
  architecture?: number;
  nature?: number;
  military?: number;
}

/** Styled variant of section content (same info, different language/level) */
export interface SectionVariant {
  title?: string;
  content: string;
}

/** Section = narrative atom for one entity */
export interface Section {
  id: string;
  subjectEntityId: string;
  relatedEntityIds?: string[];
  title: string;
  content: string;
  teaser?: string;
  mediaIds?: string[];
  importance: number; // 0–100
  thematicScores?: ThematicScores;
  readingTimeSec?: number;
  variants?: Record<string, SectionVariant>;
  createdAt: string; // ISO
}

/** Media (pilot: image only) */
export interface Media {
  id: string;
  type: "image";
  storageUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt: string; // ISO
}

/** Route (optional pilot) */
export interface Route {
  id: string;
  name: string;
  description?: string;
  entityIds: string[];
  startEntityId?: string;
}
