"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRoute, getEntities } from "@/lib/api/pilot";
import { AppHeader } from "@/components/AppHeader";
import { BreadcrumbProvider, routeBreadcrumb } from "@/contexts/BreadcrumbContext";
import type { Entity, Route } from "@/model/pilot/types";

function orderedPoints(entityIds: string[], entities: Entity[]): Entity[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const result: Entity[] = [];
  for (const id of entityIds) {
    const entity = byId.get(id);
    if (entity) result.push(entity);
  }
  return result;
}

export default function RoutePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const [routeRes, entities] = await Promise.all([
          getRoute(id),
          getEntities(),
        ]);
        if (cancelled) return;

        const ordered = orderedPoints(routeRes.entityIds, entities);
        setRoute(routeRes);
        setPoints(ordered);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load route", err);

        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("not found")
        ) {
          setNotFound(true);
        } else {
          setError("Nie udało się załadować ścieżki.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Brak identyfikatora ścieżki.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Ładowanie ścieżki...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Nie znaleziono takiej ścieżki.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!route) return null;

  return (
    <BreadcrumbProvider value={routeBreadcrumb(route)}>
      <div className="min-h-screen bg-stone-50">
        <AppHeader backHref="/" title={route.name} />

        <main className="container mx-auto px-6 py-8 max-w-4xl">
        <p className="text-sm text-stone-500 mb-1" aria-label="Identyfikator ścieżki">
          {route.id}
        </p>
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
          {route.name}
        </h1>
        {route.description && (
          <p className="text-stone-600 leading-relaxed mb-8">
            {route.description}
          </p>
        )}

        <h2 className="text-xl font-semibold text-stone-800 mb-4">
          Punkty na ścieżce
        </h2>
        <ul className="space-y-2">
          {points.map((entity, index) => (
            <li key={entity.id}>
              <Link
                href={`/route/${id}/entity/${entity.id}`}
                className="group block rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow p-3"
              >
                <span className="text-stone-400 text-xs font-medium">
                  {index + 1}.
                </span>{" "}
                <span className="font-semibold text-stone-800 text-sm group-hover:text-amber-700 transition-colors">
                  {entity.name}
                </span>
                {entity.shortDescription && (
                  <p className="text-xs text-stone-500 mt-0.5 ml-4 line-clamp-1">
                    {entity.shortDescription}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {points.length === 0 && (
          <p className="text-stone-500 py-4">Brak punktów na tej ścieżce.</p>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </main>

        <footer className="border-t py-6 text-center text-sm text-stone-400 mt-12">
          Knowledge Explorer • Demo
        </footer>
      </div>
    </BreadcrumbProvider>
  );
}
