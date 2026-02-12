"use client";

import Link from "next/link";
import type { RouteContext } from "@/model/pilot/types";

interface RouteNavigationProps {
  routeContext: RouteContext;
}

export function RouteNavigation({ routeContext }: RouteNavigationProps) {
  const { routeId, routeName, prevEntity, nextEntity } = routeContext;
  const hasNav = prevEntity || nextEntity;
  if (!hasNav) return null;

  return (
    <div className="mt-12 pt-8 border-t border-stone-200">
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
        Na ścieżce: {routeName}
      </h2>
      <div className="flex flex-wrap gap-4">
        {prevEntity && (
          <Link
            href={`/route/${routeId}/entity/${prevEntity.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow px-5 py-4 border border-stone-100"
          >
            <span className="text-stone-400">←</span>
            <span className="font-semibold text-stone-800 group-hover:text-amber-700">
              Poprzedni: {prevEntity.name}
            </span>
          </Link>
        )}
        {nextEntity && (
          <Link
            href={`/route/${routeId}/entity/${nextEntity.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow px-5 py-4 border border-stone-100"
          >
            <span className="font-semibold text-stone-800 group-hover:text-amber-700">
              Następny: {nextEntity.name}
            </span>
            <span className="text-stone-400">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
