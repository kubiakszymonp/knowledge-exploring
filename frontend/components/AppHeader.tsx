"use client";

import Link from "next/link";
import { Menu, ArrowLeft } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

type AppHeaderProps = {
  title?: string;
  backHref?: string;
};

export function AppHeader({ title, backHref }: AppHeaderProps) {
  const displayTitle = title ?? "Knowledge Explorer";

  return (
    <header className="border-b bg-white sticky top-0 z-[1000]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center shrink-0 py-1 -my-1 text-stone-600 hover:text-stone-800 transition-colors"
              aria-label="Wróć"
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={2} />
            </Link>
          )}
          <h1 className="text-xl font-semibold text-stone-800 truncate">
            {backHref ? (
              displayTitle
            ) : (
              <Link
                href="/"
                className="hover:text-amber-600 transition-colors"
              >
                {displayTitle}
              </Link>
            )}
          </h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Otwórz menu"
              className="inline-flex items-center justify-center shrink-0 rounded-md border border-stone-200 bg-white p-2 text-stone-700 shadow-sm hover:bg-stone-50 hover:text-amber-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="px-4 py-3 space-y-2">
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-stone-800 hover:bg-stone-100 hover:text-amber-700 transition-colors"
              >
                O aplikacji
              </Link>
              <Link
                href="/settings"
                className="block rounded-md px-3 py-2 text-stone-800 hover:bg-stone-100 hover:text-amber-700 transition-colors"
              >
                Preferencje
              </Link>
            </nav>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
