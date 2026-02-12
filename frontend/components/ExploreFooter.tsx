"use client";

import Link from "next/link";

export function ExploreFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 max-w-3xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/places"
            className="text-[11px] sm:text-xs text-stone-300 hover:text-amber-500 hover:underline underline-offset-4 transition-colors text-right"
          >
            wszystkie miejsca
          </Link>
        </div>
      </div>
    </footer>
  );
}
