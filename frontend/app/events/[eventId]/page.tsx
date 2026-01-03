import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

const eventsData: Record<string, {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  content: {
    sections: Array<{
      title: string;
      text: string;
      image?: string;
    }>;
  };
}> = {
  "event-1": {
    id: "event-1",
    title: "Wystawa średniowiecznych fortyfikacji",
    description: "Odkryj historię obronnych struktur miejskich w Krakowie",
    date: "15 marca 2024",
    location: "Muzeum Historyczne, Kraków",
    image: "https://picsum.photos/seed/defensive-structure/400/300",
    content: {
      sections: [
        {
          title: "O wystawie",
          text: "Wystawa prezentuje unikalną kolekcję artefaktów związanych z średniowiecznymi fortyfikacjami Krakowa. Zobaczysz oryginalne elementy murów obronnych, narzędzia używane przez budowniczych oraz modele przedstawiające rozwój systemu obronnego miasta na przestrzeni wieków.",
          image: "https://picsum.photos/seed/defensive-structure/400/300",
        },
        {
          title: "Wystawione eksponaty",
          text: "Na wystawie znajdziesz m.in. fragmenty kamiennych murów, cegły z oryginalnymi znakami cegielni, narzędzia murarskie z XIV wieku oraz dokumenty historyczne opisujące proces budowy i modernizacji fortyfikacji. Szczególną uwagę zwróć na interaktywną makietę przedstawiającą Kraków w okresie największego rozkwitu systemu obronnego.",
        },
        {
          title: "Informacje praktyczne",
          text: "Wystawa jest dostępna od wtorku do niedzieli w godzinach 10:00-18:00. Bilety można zakupić online lub w kasie muzeum. Dla grup zorganizowanych dostępne są oprowadzania z przewodnikiem. Wystawa potrwa do końca maja 2024 roku.",
        },
      ],
    },
  },
  "event-2": {
    id: "event-2",
    title: "Spacer po murach obronnych",
    description: "Zwiedzanie z przewodnikiem po zachowanych fragmentach murów",
    date: "22 marca 2024",
    location: "Brama Floriańska, Kraków",
    image: "https://picsum.photos/seed/defensive-structure/400/300",
    content: {
      sections: [
        {
          title: "O spacerze",
          text: "Wyjątkowa okazja, aby przejść się wzdłuż zachowanych fragmentów średniowiecznych murów obronnych Krakowa. Podczas spaceru poznasz historię każdej baszty, dowiesz się, jak funkcjonował system obronny miasta oraz zobaczysz miejsca, które na co dzień są niedostępne dla zwiedzających.",
          image: "https://picsum.photos/seed/defensive-structure/400/300",
        },
        {
          title: "Trasa spaceru",
          text: "Spacer rozpoczyna się przy Bramie Floriańskiej i prowadzi wzdłuż zachowanych fragmentów murów do Barbakanu. Po drodze zobaczysz m.in. Basztę Stolarską, Basztę Ciesielską oraz fragmenty murów z różnymi fazami budowy. Przewodnik opowie o historii każdego z tych miejsc oraz o ich roli w systemie obronnym miasta.",
        },
        {
          title: "Informacje praktyczne",
          text: "Spacer trwa około 90 minut. Zbiórka o godzinie 14:00 przy Bramie Floriańskiej. Wymagana jest wcześniejsza rejestracja. Spacer odbywa się niezależnie od pogody, dlatego prosimy o odpowiedni ubiór. Dla uczestników dostępne są audioprzewodniki.",
        },
      ],
    },
  },
  "event-3": {
    id: "event-3",
    title: "Warsztaty architektury obronnej",
    description: "Poznaj tajniki budowy średniowiecznych systemów obronnych",
    date: "28 marca 2024",
    location: "Centrum Edukacji, Kraków",
    image: "https://picsum.photos/seed/defensive-structure/400/300",
    content: {
      sections: [
        {
          title: "O warsztatach",
          text: "Interaktywne warsztaty, podczas których poznasz tajniki budowy średniowiecznych systemów obronnych. Pod okiem doświadczonych edukatorów zbudujesz własną makietę fragmentu muru obronnego, poznasz techniki budowlane używane w średniowieczu oraz dowiesz się, jak projektowano i wznoszono fortyfikacje.",
          image: "https://picsum.photos/seed/defensive-structure/400/300",
        },
        {
          title: "Program warsztatów",
          text: "Warsztaty składają się z części teoretycznej i praktycznej. W pierwszej części poznasz historię i rozwój architektury obronnej, materiały i narzędzia używane w budowie oraz zasady projektowania fortyfikacji. W części praktycznej zbudujesz własną makietę, używając materiałów podobnych do tych, które stosowano w średniowieczu.",
        },
        {
          title: "Informacje praktyczne",
          text: "Warsztaty przeznaczone są dla osób w wieku 12+. Trwają 3 godziny. Wszystkie materiały są zapewnione. Liczba miejsc ograniczona - wymagana wcześniejsza rejestracja. Warsztaty odbywają się w grupach maksymalnie 20 osobowych.",
        },
      ],
    },
  },
  "event-4": {
    id: "event-4",
    title: "Nocne zwiedzanie Barbakanu",
    description: "Wyjątkowa okazja zobaczenia Barbakanu w nocnej iluminacji",
    date: "5 kwietnia 2024",
    location: "Barbakan, Kraków",
    image: "https://picsum.photos/seed/defensive-structure/400/300",
    content: {
      sections: [
        {
          title: "O wydarzeniu",
          text: "Wyjątkowa okazja, aby zobaczyć Barbakan w zupełnie nowym świetle - dosłownie! Podczas nocnego zwiedzania budowla zostanie specjalnie oświetlona, tworząc niepowtarzalną atmosferę. Przewodnik opowie o historii tego unikalnego obiektu oraz o jego roli w systemie obronnym Krakowa.",
          image: "https://picsum.photos/seed/defensive-structure/400/300",
        },
        {
          title: "Co zobaczysz",
          text: "Podczas zwiedzania zobaczysz wnętrze Barbakanu, strzelnice, pomieszczenia dla straży oraz unikalne detale architektoniczne, które w świetle dziennym często umykają uwadze. Specjalna iluminacja podkreśli charakterystyczne elementy budowli, takie jak masywne mury, strzelnice i dekoracyjne detale.",
        },
        {
          title: "Informacje praktyczne",
          text: "Zwiedzanie rozpoczyna się o godzinie 20:00 i trwa około 60 minut. Wymagana jest wcześniejsza rejestracja ze względu na ograniczoną liczbę miejsc. Zwiedzanie odbywa się niezależnie od pogody. Dla uczestników dostępne są latarki, choć główne oświetlenie zapewnia specjalna iluminacja obiektu.",
        },
      ],
    },
  },
};

export default async function EventPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = eventsData[eventId];

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-[1000]">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
            ← Powrót
          </Link>
          <h1 className="text-xl font-semibold text-stone-800">Wydarzenie</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-lg mb-6">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-stone-600 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
          <p className="text-lg text-stone-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {event.content.sections.map((section, index) => (
            <article key={index} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                {section.title}
              </h2>
              {section.image && (
                <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </article>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-stone-400 mt-12">
        Knowledge Explorer • Demo
      </footer>
    </div>
  );
}

