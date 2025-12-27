import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <header className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-16 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            Proof of Concept
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Knowledge Explorer
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Interaktywna eksploracja wiedzy przez graf połączonych faktów.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• Wizualizacja grafu wiedzy</li>
            <li>• Stylizacje treści dla różnych odbiorców</li>
            <li>• Zajawki na połączeniach ułatwiające nawigację</li>
          </ul>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/brama_florianska/explore">Eksploruj Bramę Floriańską</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/brama_florianska/graph">Zobacz Graf</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Knowledge Explorer • Proof of Concept</p>
      </footer>
    </div>
  );
}
