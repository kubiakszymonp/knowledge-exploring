import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const features = [
    {
      title: "Graf Wiedzy",
      description:
        "Interaktywna wizualizacja połączeń między faktami i sekcjami.",
      tags: ["Cytoscape.js", "Interaktywny"],
    },
    {
      title: "Stylizacje Treści",
      description:
        "Automatyczne przeredagowanie artykułów dla różnych odbiorców: dzieci, dorośli, humorystycznie.",
      tags: ["GPT", "Profile"],
    },
    {
      title: "Zajawki Krawędzi",
      description:
        "Generowanie pytań i zachęt na połączeniach grafu, by ułatwić eksplorację.",
      tags: ["UX", "Nawigacja"],
    },
    {
      title: "Edytor Grafu",
      description:
        "Panel do przeglądania i edycji węzłów, krawędzi oraz ich stylizacji.",
      tags: ["Shadcn", "Drawer"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Proof of Concept
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Knowledge Explorer
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            System eksploracji wiedzy oparty na grafach. Każdy obiekt (miejsce,
            temat, postać) to osobny graf z węzłami faktów i krawędziami
            nawigacyjnymi.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/brama_florianska/explore">Eksploruj Bramę Floriańską</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/brama_florianska/graph">Zobacz Graf</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Główne funkcje
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Struktura */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Architektura Modelu
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <div className="flex items-start gap-4">
              <Badge className="mt-1 shrink-0">Node</Badge>
              <p>
                Neutralna, faktograficzna jednostka wiedzy z tytułem, tekstem,
                tagami i załącznikami (zdjęcia, mapy, audio).
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1 shrink-0">Edge</Badge>
              <p>
                Skierowane połączenie między węzłami. Etykieta opisuje relację,
                zajawka zachęca do kliknięcia.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1 shrink-0">Stylizacja</Badge>
              <p>
                Wersje tekstów dopasowane do profilu odbiorcy: dziecięcy,
                dorosły, humorystyczny, ekspercki.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Badge className="mt-1 shrink-0">Attachment</Badge>
              <p>
                Media jako załączniki węzła, nie osobne elementy grafu. Zdjęcia,
                filmy, audio, mapy, dokumenty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Knowledge Explorer • Proof of Concept</p>
      </footer>
    </div>
  );
}
