import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoute, getEntities } from "@/lib/api/pilot";
import { AppHeader } from "@/components/AppHeader";
import type { Entity } from "@/model/pilot/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

function orderedPoints(entityIds: string[], entities: Entity[]): Entity[] {
  const byId = new Map(entities.map((e) => [e.id, e]));
  const result: Entity[] = [];
  for (const id of entityIds) {
    const entity = byId.get(id);
    if (entity) result.push(entity);
  }
  return result;
}

export default async function RoutePage({ params }: PageProps) {
  const { id } = await params;

  let route;
  try {
    route = await getRoute(id);
  } catch {
    notFound();
  }

  const entities = await getEntities();
  const points = orderedPoints(route.entityIds, entities);

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader backHref="/" backBehavior="history" title="Ścieżka zwiedzania" />

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
  );
}
