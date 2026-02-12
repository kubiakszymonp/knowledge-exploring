import type { Entity, Section, Media, Route } from "@/model/pilot/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In the browser, use relative URLs so requests go to the current origin.
    return "";
  }

  // On the server, prefer an explicit base URL when provided (e.g. for scripts),
  // otherwise use a relative URL so Next.js can handle internal routing during
  // build/SSR without depending on an external HTTP listener.
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

async function fetchJson<T>(url: string): Promise<T> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${url}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function getEntities(): Promise<Entity[]> {
  return fetchJson<Entity[]>("/api/entities");
}

export async function getEntity(id: string): Promise<Entity> {
  return fetchJson<Entity>(`/api/entities/${encodeURIComponent(id)}`);
}

export async function getEntitySections(entityId: string): Promise<Section[]> {
  return fetchJson<Section[]>(
    `/api/entities/${encodeURIComponent(entityId)}/sections`
  );
}

export async function getMediaList(): Promise<Media[]> {
  return fetchJson<Media[]>("/api/media");
}

export async function getMedia(id: string): Promise<Media> {
  return fetchJson<Media>(`/api/media/${encodeURIComponent(id)}`);
}

export async function getRoutes(): Promise<Route[]> {
  return fetchJson<Route[]>("/api/routes");
}

export async function getRoute(id: string): Promise<Route> {
  return fetchJson<Route>(`/api/routes/${encodeURIComponent(id)}`);
}
