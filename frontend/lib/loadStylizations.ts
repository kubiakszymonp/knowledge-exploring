// Funkcje do ładowania stylizacji z wygenerowanych plików

interface StylizedArticle {
  nodeId: string;
  style: string;
  title: string;
  text: string;
  generatedAt?: string;
}

interface StylizedEdge {
  from: string;
  to: string;
  style: string;
  teaser: string;
  generatedAt?: string;
}

const AVAILABLE_STYLES = ["adult", "kids", "funny", "vulgar", "storytelling"];
const AVAILABLE_EDGE_STYLES = ["informative", "kids", "clickbait", "shocking", "mysterious"];

export async function getNodeStylizations(nodeId: string): Promise<StylizedArticle[]> {
  const stylizations: StylizedArticle[] = [];

  for (const style of AVAILABLE_STYLES) {
    try {
      // Próbujemy załadować plik z public/stylizations/
      const response = await fetch(`/stylizations/${style}/${nodeId}.json`);
      if (response.ok) {
        const data = await response.json();
        stylizations.push(data);
      }
    } catch (error) {
      console.warn(`Could not load stylization for ${nodeId} in style ${style}:`, error);
    }
  }

  return stylizations;
}

export async function getEdgeStylizations(
  fromId: string,
  toId: string,
  articleStyle: string = "adult"
): Promise<StylizedEdge[]> {
  const stylizations: StylizedEdge[] = [];
  const edgeKey = `${fromId}__${toId}`;

  for (const edgeStyle of AVAILABLE_EDGE_STYLES) {
    try {
      const response = await fetch(
        `/stylizations/edges/${articleStyle}_${edgeStyle}/${edgeKey}.json`
      );
      if (response.ok) {
        const data = await response.json();
        stylizations.push(data);
      }
    } catch (error) {
      console.warn(
        `Could not load edge stylization for ${fromId}->${toId} in style ${edgeStyle}:`,
        error
      );
    }
  }

  return stylizations;
}

// Synchroniczna wersja która ładuje na żądanie - używana w komponentach
export function getNodeStylizationsSync(nodeId: string): StylizedArticle[] {
  // Client-side nie może synchronicznie ładować - zwróć pustą tablicę
  // Dane będą ładowane asynchronicznie w useEffect
  return [];
}

export function getEdgeStylizationsSync(fromId: string, toId: string): StylizedEdge[] {
  return [];
}
