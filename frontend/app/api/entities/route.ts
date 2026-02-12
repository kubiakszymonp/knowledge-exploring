import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Entity } from "@/model/pilot/types";

export async function GET() {
  try {
    const dataRoot = getDataRoot();
    const entitiesDir = path.join(dataRoot, "entities");
    let entries: { name: string; isDirectory: () => boolean }[];
    try {
      entries = await fs.readdir(entitiesDir, { withFileTypes: true });
    } catch (err: unknown) {
      const isNotFound =
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as NodeJS.ErrnoException).code === "ENOENT";
      if (isNotFound) return NextResponse.json([]);
      throw err;
    }
    const entities: Entity[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const entityPath = path.join(entitiesDir, entry.name, "entity.json");
      try {
        const raw = await fs.readFile(entityPath, "utf-8");
        const entity = JSON.parse(raw) as Entity;
        entities.push(entity);
      } catch {
        // skip invalid or missing entity.json
      }
    }

    return NextResponse.json(entities);
  } catch (err) {
    console.error("[api/entities]", err);
    return NextResponse.json(
      { error: "Failed to list entities" },
      { status: 500 }
    );
  }
}
