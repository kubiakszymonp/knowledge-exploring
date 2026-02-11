import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Media } from "@/model/pilot/types";

export async function GET() {
  try {
    const dataRoot = getDataRoot();
    const mediaDir = path.join(dataRoot, "media");
    const entries = await fs.readdir(mediaDir, { withFileTypes: true });
    const mediaList: Media[] = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const mediaPath = path.join(mediaDir, entry.name);
      try {
        const raw = await fs.readFile(mediaPath, "utf-8");
        const media = JSON.parse(raw) as Media;
        mediaList.push(media);
      } catch {
        // skip invalid file
      }
    }

    return NextResponse.json(mediaList);
  } catch (err) {
    console.error("[api/media]", err);
    return NextResponse.json(
      { error: "Failed to list media" },
      { status: 500 }
    );
  }
}
