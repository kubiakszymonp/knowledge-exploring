"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const QR_SCANNER_ELEMENT_ID = "qr-scanner-root";

function getInternalPath(decodedText: string): string | null {
  const trimmed = decodedText.trim();
  if (trimmed.startsWith("/")) {
    try {
      const path = new URL(trimmed, "https://dummy").pathname;
      return path.startsWith("/") ? path : `/${path}`;
    } catch {
      return null;
    }
  }
  try {
    const url = new URL(trimmed);
    if (typeof window !== "undefined" && url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

type QrScannerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QrScanner({ open, onOpenChange }: QrScannerProps) {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCameraError(null);
    setError(null);
    let cancelled = false;

    const startScanner = () => {
      if (cancelled) return;
      const container = containerRef.current;
      if (!container || !document.getElementById(QR_SCANNER_ELEMENT_ID)) {
        setCameraError("Błąd inicjalizacji skanera. Spróbuj ponownie.");
        return;
      }

      const scanner = new Html5Qrcode(QR_SCANNER_ELEMENT_ID, { verbose: false });
      scannerRef.current = scanner;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      const constraints: MediaTrackConstraints = { facingMode: "environment" };

      scanner
        .start(
          constraints,
          config,
          (decodedText) => {
            if (cancelled) return;
            const path = getInternalPath(decodedText);
            if (path) {
              scanner.stop().then(() => {
                if (cancelled) return;
                scannerRef.current = null;
                onOpenChange(false);
                router.push(path);
              });
            } else {
              setError("To nie jest link z naszej strony.");
            }
          },
          () => {
            // scan error (no QR in frame) – ignore
          }
        )
        .catch((err: Error) => {
          if (cancelled) return;

          console.error("[QrScanner] Camera error", err.name, err.message);

          const name = err.name;
          let message: string;

          if (name === "NotAllowedError" || name === "SecurityError") {
            message =
              "Brak dostępu do kamery. Zezwól na użycie kamery dla tej strony w ustawieniach przeglądarki lub systemu.";
          } else if (name === "NotFoundError" || name === "OverconstrainedError") {
            message =
              "Nie znaleziono odpowiedniej kamery. Upewnij się, że urządzenie ma aparat i że nie jest on blokowany przez system.";
          } else if (name === "NotReadableError" || name === "TrackStartError") {
            message =
              "Nie udało się uzyskać dostępu do kamery. Spróbuj ponownie uruchomić przeglądarkę lub urządzenie.";
          } else {
            message =
              "Nie udało się uruchomić kamery (typ błędu: " +
              (name || "nieznany") +
              "). Sprawdź uprawnienia do kamery dla tej strony.";
          }

          setCameraError(message);
        });
    };

    // Treść Dialogu jest w portalu – element trafia do DOM z opóźnieniem
    const t = setTimeout(startScanner, 200);

    return () => {
      cancelled = true;
      clearTimeout(t);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
      scannerRef.current = null;
    };
  }, [open, onOpenChange, router]);

  const handleOpenChange = (next: boolean) => {
    if (!next && scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setError(null);
    setCameraError(null);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Skanuj kod QR</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div
            ref={containerRef}
            id={QR_SCANNER_ELEMENT_ID}
            className="h-[250px] w-full overflow-hidden rounded-lg bg-stone-100"
          />
          {cameraError && (
            <p className="text-sm text-destructive" role="alert">
              {cameraError}
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Anuluj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
