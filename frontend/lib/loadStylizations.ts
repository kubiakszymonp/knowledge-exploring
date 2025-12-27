// Funkcje do ładowania stylizacji z wygenerowanych plików

export interface StylizedArticle {
  nodeId: string;
  style: string;
  title: string;
  text: string;
  generatedAt?: string;
}

export interface StylizedEdge {
  from: string;
  to: string;
  style: string;
  teaser: string;
  generatedAt?: string;
}

export const AVAILABLE_STYLES = ["adult", "kids", "vulgar"] as const;
export const AVAILABLE_EDGE_STYLES = ["informative", "kids", "clickbait", "shocking", "mysterious"] as const;

export type ArticleStyle = typeof AVAILABLE_STYLES[number];
export type EdgeStyle = typeof AVAILABLE_EDGE_STYLES[number];

export const STYLE_LABELS: Record<ArticleStyle, string> = {
  adult: "Standardowy",
  kids: "Dla dzieci",
  vulgar: "Wulgarny",
};

export const EDGE_STYLE_LABELS: Record<EdgeStyle, string> = {
  informative: "Informacyjny",
  kids: "Dla dzieci",
  clickbait: "Clickbait",
  shocking: "Szokujący",
  mysterious: "Tajemniczy",
};

// Pobiera stylizację artykułu dla danego węzła i stylu
export async function getNodeStylization(
  nodeId: string,
  style: ArticleStyle
): Promise<StylizedArticle | null> {
  try {
    const response = await fetch(`/stylizations/${style}/${nodeId}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(`Could not load stylization for ${nodeId} in style ${style}:`, error);
  }
  return null;
}

// Pobiera stylizację krawędzi (zależy tylko od edgeStyle, nie od articleStyle)
export async function getEdgeStylization(
  fromId: string,
  toId: string,
  edgeStyle: EdgeStyle
): Promise<StylizedEdge | null> {
  const edgeKey = `${fromId}__${toId}`;
  try {
    const response = await fetch(
      `/stylizations/edges/${edgeStyle}/${edgeKey}.json`
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(
      `Could not load edge stylization for ${fromId}->${toId} in style ${edgeStyle}:`,
      error
    );
  }
  return null;
}

// Pobiera wszystkie stylizacje dla węzła
export async function getNodeStylizations(nodeId: string): Promise<StylizedArticle[]> {
  const stylizations: StylizedArticle[] = [];

  for (const style of AVAILABLE_STYLES) {
    const stylization = await getNodeStylization(nodeId, style);
    if (stylization) {
      stylizations.push(stylization);
    }
  }

  return stylizations;
}

// Pobiera wszystkie stylizacje dla krawędzi
export async function getEdgeStylizations(
  fromId: string,
  toId: string
): Promise<StylizedEdge[]> {
  const stylizations: StylizedEdge[] = [];

  for (const edgeStyle of AVAILABLE_EDGE_STYLES) {
    const stylization = await getEdgeStylization(fromId, toId, edgeStyle);
    if (stylization) {
      stylizations.push(stylization);
    }
  }

  return stylizations;
}
