"use client";

import { useEffect, useState } from "react";
import { getEntities, getRoutes } from "@/lib/api/pilot";
import type { Entity, Route } from "@/model/pilot/types";
import { HomeClient } from "./HomeClient";

export default function Home() {
  const [places, setPlaces] = useState<Entity[]>([]);
  const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [entities, routes] = await Promise.all([
          getEntities(),
          getRoutes(),
        ]);
        if (cancelled) return;

        const placesOnly = entities.filter((e) => e.type === "place");
        const topRoutes = routes.slice(0, 3);

        setPlaces(placesOnly);
        setRecommendedRoutes(topRoutes);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load home data", err);
        setError("Nie udało się załadować danych strony głównej.");
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Ładowanie strony...</p>
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

  return (
    <HomeClient
      places={places}
      recommendedRoutes={recommendedRoutes}
    />
  );
}
