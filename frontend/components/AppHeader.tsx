"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ArrowLeft, Home, Info, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
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
  /** When "history", back button uses router.back(); when "href", uses backHref (default). */
  backBehavior?: "href" | "history";
};

export function AppHeader({
  title,
  backHref,
  backBehavior = "href",
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const displayTitle = title ?? "Knowledge Explorer";
  const showBack = Boolean(backHref);
  const useHistoryBack = showBack && backBehavior === "history";

  const navLinkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      pathname === href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
    );

  return (
    <header className="border-b bg-white sticky top-0 z-[1000]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {showBack &&
            (useHistoryBack ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center shrink-0 py-1 -my-1 text-stone-600 hover:text-stone-800 transition-colors"
                aria-label="Wróć"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={2} />
              </button>
            ) : (
              <Link
                href={backHref!}
                className="flex items-center shrink-0 py-1 -my-1 text-stone-600 hover:text-stone-800 transition-colors"
                aria-label="Wróć"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={2} />
              </Link>
            ))}
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
          <SheetContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <SheetHeader>
              <SheetTitle className="text-sidebar-foreground">Menu</SheetTitle>
            </SheetHeader>
            <nav className="px-4 py-4 space-y-1">
              <Link href="/" className={navLinkClass("/")}>
                <Home className="w-5 h-5 shrink-0" />
                <span>Strona główna</span>
              </Link>
              <Link href="/about" className={navLinkClass("/about")}>
                <Info className="w-5 h-5 shrink-0" />
                <span>O aplikacji</span>
              </Link>
              <Link href="/settings" className={navLinkClass("/settings")}>
                <Settings className="w-5 h-5 shrink-0" />
                <span>Preferencje</span>
              </Link>
            </nav>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
