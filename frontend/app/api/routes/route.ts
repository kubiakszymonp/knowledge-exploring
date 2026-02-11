import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataRoot } from "@/lib/getDataRoot";
import type { Route } from "@/model/pilot/types";

export async function GET() {
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
      if (isNotFound) return NextResponse.json([]);
      throw err;
    }

    const routes: Route[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const routePath = path.join(routesDir, entry.name);
      try {
        const raw = await fs.readFile(routePath, "utf-8");
        const route = JSON.parse(raw) as Route;
        routes.push(route);
      } catch {
        // skip invalid file
      }
    }

    return NextResponse.json(routes);
  } catch (err) {
    console.error("[api/routes]", err);
    return NextResponse.json(
      { error: "Failed to list routes" },
      { status: 500 }
    );
  }
}
