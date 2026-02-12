import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Section } from "@/model/pilot/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: entityId } = await params;
  if (!entityId) {
    return NextResponse.json({ error: "Missing entity id" }, { status: 400 });
  }

  try {
    const dataRoot = getDataRoot();
    const sectionsDir = path.join(dataRoot, "entities", entityId, "sections");
    const entries = await fs.readdir(sectionsDir, { withFileTypes: true });
    const sections: Section[] = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const sectionPath = path.join(sectionsDir, entry.name);
      try {
        const raw = await fs.readFile(sectionPath, "utf-8");
        const section = JSON.parse(raw) as Section;
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

    return NextResponse.json(sections);
  } catch (err: unknown) {
    const isNotFound =
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT";
    if (isNotFound) {
      return NextResponse.json([]);
    }
    console.error("[api/entities/[id]/sections]", err);
    return NextResponse.json(
      { error: "Failed to load sections" },
      { status: 500 }
    );
  }
}
