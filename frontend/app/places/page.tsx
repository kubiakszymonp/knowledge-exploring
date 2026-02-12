"use client";

import { useEffect, useState } from "react";
import { getEntities } from "@/lib/api/pilot";
import type { Entity } from "@/model/pilot/types";
import { PlacesClient } from "./PlacesClient";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const entities = await getEntities();
        if (cancelled) return;
        const onlyPlaces = entities.filter((e) => e.type === "place");
        setPlaces(onlyPlaces);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load places", err);
        setError("Nie udało się załadować listy miejsc.");
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
        <p className="text-stone-500 text-sm">Ładowanie miejsc...</p>
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

  return <PlacesClient places={places} />;
}
