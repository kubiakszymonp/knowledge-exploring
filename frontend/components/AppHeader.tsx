"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ArrowLeft, Home, Settings, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { QrScanner } from "@/components/QrScanner";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

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
  const breadcrumb = useBreadcrumb();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const useContextNav = breadcrumb.items.length > 0 && breadcrumb.backHref != null;
  const effectiveBackHref = useContextNav ? breadcrumb.backHref! : backHref;
  const showBack = Boolean(effectiveBackHref);
  const useHistoryBack = !useContextNav && showBack && backBehavior === "history";

  const displayTitle = title ?? "Knowledge Explorer";

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
                href={effectiveBackHref!}
                className="flex items-center shrink-0 py-1 -my-1 text-stone-600 hover:text-stone-800 transition-colors"
                aria-label="Wróć"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={2} />
              </Link>
            ))}
          {useContextNav ? (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-sm">
              {breadcrumb.items.map((item, i) => {
                const isLast = i === breadcrumb.items.length - 1;
                return (
                  <span key={i} className="flex items-center gap-1.5 min-w-0">
                    {i > 0 && (
                      <span className="text-stone-400 shrink-0" aria-hidden>
                        /
                      </span>
                    )}
                    {isLast || !item.href ? (
                      <span className="font-semibold text-stone-800 truncate">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-stone-500 hover:text-amber-600 transition-colors truncate"
                      >
                        {item.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          ) : (
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
          )}
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
              <Link href="/" className={navLinkClass("/")} onClick={() => setMenuOpen(false)}>
                <Home className="w-5 h-5 shrink-0" />
                <span>Strona główna</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setScannerOpen(true);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <span>Skanuj kod QR</span>
              </button>
              {/* <Link href="/about" className={navLinkClass("/about")} onClick={() => setMenuOpen(false)}>
                <Info className="w-5 h-5 shrink-0" />
                <span>O aplikacji</span>
              </Link> */}
              <Link href="/settings" className={navLinkClass("/settings")} onClick={() => setMenuOpen(false)}>
                <Settings className="w-5 h-5 shrink-0" />
                <span>Preferencje</span>
              </Link>
            </nav>
            <SheetFooter />
          </SheetContent>
        </Sheet>
        <QrScanner open={scannerOpen} onOpenChange={setScannerOpen} />
      </div>
    </header>
  );
}
