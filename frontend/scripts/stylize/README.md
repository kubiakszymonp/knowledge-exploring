# Stylizacja Artykułów i Krawędzi

Skrypty do generowania stylizowanych wersji artykułów i zajawek dla krawędzi grafu wiedzy.

## Wymagania

1. Node.js + npm
2. Plik `.env` z `OPENAI_API_KEY`

## Instalacja

```bash
npm install
```

## Użycie

### Stylizacja artykułów (węzłów)

```bash
# Jeden styl
npm run stylize [grafPath] [styleName]

# Wszystkie style równolegle
npm run stylize:all

# Przykłady
npm run stylize ../../data/brama_florianska.json adult
npm run stylize:all
```

**Dostępne style artykułów:**
- `adult` - Dorosły, merytoryczny
- `kids` - Dla dzieci 8-12 lat
- `funny` - Humorystyczny
- `vulgar` - Wulgarny, uliczny
- `storytelling` - Opowieść/audiobook

### Stylizacja krawędzi (zajawek)

```bash
# Jeden styl
npm run stylize-edges [grafPath] [edgeStyleName] [articleStyleName]

# Wszystkie style równolegle
npm run stylize-edges:all

# Przykłady
npm run stylize-edges ../../data/brama_florianska.json informative adult
npm run stylize-edges:all
```

**Dostępne style krawędzi:**
- `informative` - Informacyjna, rzeczowa
- `kids` - Dla dzieci, entuzjastyczna
- `clickbait` - Sensacyjna, niedopowiedziana
- `shocking` - Dramatyczna, szokująca
- `mysterious` - Tajemnicza, intrygująca

## Wyjście

Pliki generowane są w `./output/`:

```
output/
├── adult/
│   ├── root_brama.json
│   ├── sec_historia.json
│   └── _all.json
├── kids/
│   └── ...
└── edges/
    ├── adult_informative/
    │   ├── root_brama__sec_historia.json
    │   └── _all.json
    └── adult_clickbait/
        └── ...
```

## Generowanie równoległe

Domyślnie argumentem `all` generuje wszystkie style równolegle, co znacznie przyspiesza proces:

```bash
# Generuje 5 stylów artykułów równolegle
npm run stylize:all

# Generuje 5 stylów krawędzi równolegle
npm run stylize-edges:all
```

## Kolejność

1. Najpierw wygeneruj stylizowane artykuły
2. Potem wygeneruj zajawki dla krawędzi (używają stylizowanych artykułów jako input)

```bash
npm run stylize:all
npm run stylize-edges:all
```






