import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Entity, Section, Media, Route } from "@/model/pilot/types";

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function getEntities(): Promise<Entity[]> {
  try {
    const dataRoot = getDataRoot();
    const entitiesDir = path.join(dataRoot, "entities");
    const entries = await fs.readdir(entitiesDir, { withFileTypes: true });
    const entities: Entity[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const entityPath = path.join(entitiesDir, entry.name, "entity.json");
      try {
        const entity = await readJsonFile<Entity>(entityPath);
        entities.push(entity);
      } catch {
        // skip invalid or missing entity.json
      }
    }

    return entities;
  } catch (err) {
    // Let callers decide how to handle failures; mirrors API behaviour where
    // a 500 propagates as an error from the client helpers.
    throw err;
  }
}

export async function getEntity(id: string): Promise<Entity> {
  const dataRoot = getDataRoot();
  const entityPath = path.join(dataRoot, "entities", id, "entity.json");
  return readJsonFile<Entity>(entityPath);
}

export async function getEntitySections(entityId: string): Promise<Section[]> {
  try {
    const dataRoot = getDataRoot();
    const sectionsDir = path.join(dataRoot, "entities", entityId, "sections");
    const entries = await fs.readdir(sectionsDir, { withFileTypes: true });
    const sections: Section[] = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const sectionPath = path.join(sectionsDir, entry.name);
      try {
        const section = await readJsonFile<Section>(sectionPath);
        if (section.subjectEntityId === entityId) {
          sections.push(section);
        }
      } catch {
        // skip invalid file
      }
    }

    sections.sort((a, b) => {
      const impA = a.importance ?? 0;
      const impB = b.importance ?? 0;
      if (impA !== impB) return impB - impA;
      return (a.id ?? "").localeCompare(b.id ?? "");
    });

    return sections;
  } catch (err: unknown) {
    const isNotFound =
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT";
    if (isNotFound) {
      // Mirror API semantics: missing sections directory means "no sections".
      return [];
    }
    throw err;
  }
}

export async function getMediaList(): Promise<Media[]> {
  try {
    const dataRoot = getDataRoot();
    const mediaDir = path.join(dataRoot, "media");
    const entries = await fs.readdir(mediaDir, { withFileTypes: true });
    const mediaList: Media[] = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const mediaPath = path.join(mediaDir, entry.name);
      try {
        const media = await readJsonFile<Media>(mediaPath);
        mediaList.push(media);
      } catch {
        // skip invalid file
      }
    }

    return mediaList;
  } catch (err) {
    throw err;
  }
}

export async function getRoutes(): Promise<Route[]> {
  try {
    const dataRoot = getDataRoot();
    const routesDir = path.join(dataRoot, "routes");
    let entries: { name: string; isFile: () => boolean }[];
    try {
      entries = await fs.readdir(routesDir, { withFileTypes: true });
    } catch (err: unknown) {
      const isNotFound =
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as NodeJS.ErrnoException).code === "ENOENT";
      if (isNotFound) return [];
      throw err;
    }

    const routes: Route[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const routePath = path.join(routesDir, entry.name);
      try {
        const route = await readJsonFile<Route>(routePath);
        routes.push(route);
      } catch {
        // skip invalid file
      }
    }

    return routes;
  } catch (err) {
    throw err;
  }
}

export async function getRoute(id: string): Promise<Route> {
  const dataRoot = getDataRoot();
  const routePath = path.join(dataRoot, "routes", `${id}.json`);
  return readJsonFile<Route>(routePath);
}

