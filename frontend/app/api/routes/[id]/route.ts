import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Route } from "@/model/pilot/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing route id" }, { status: 400 });
  }

  try {
    const dataRoot = getDataRoot();
    const routePath = path.join(dataRoot, "routes", `${id}.json`);
    const raw = await fs.readFile(routePath, "utf-8");
    const route = JSON.parse(raw) as Route;
    return NextResponse.json(route);
  } catch (err: unknown) {
    const isNotFound =
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT";
    if (isNotFound) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }
    console.error("[api/routes/[id]]", err);
    return NextResponse.json(
      { error: "Failed to load route" },
      { status: 500 }
    );
  }
}
