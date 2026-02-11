import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Entity } from "@/model/pilot/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing entity id" }, { status: 400 });
  }

  try {
    const dataRoot = getDataRoot();
    const entityPath = path.join(dataRoot, "entities", id, "entity.json");
    const raw = await fs.readFile(entityPath, "utf-8");
    const entity = JSON.parse(raw) as Entity;
    return NextResponse.json(entity);
  } catch (err: unknown) {
    const isNotFound =
      err && typeof err === "object" && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT";
    if (isNotFound) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }
    console.error("[api/entities/[id]]", err);
    return NextResponse.json(
      { error: "Failed to load entity" },
      { status: 500 }
    );
  }
}
