import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Media } from "@/model/pilot/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing media id" }, { status: 400 });
  }

  try {
    const dataRoot = getDataRoot();
    const mediaPath = path.join(dataRoot, "media", `${id}.json`);
    const raw = await fs.readFile(mediaPath, "utf-8");
    const media = JSON.parse(raw) as Media;
    return NextResponse.json(media);
  } catch (err: unknown) {
    const isNotFound =
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT";
    if (isNotFound) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }
    console.error("[api/media/[id]]", err);
    return NextResponse.json(
      { error: "Failed to load media" },
      { status: 500 }
    );
  }
}
