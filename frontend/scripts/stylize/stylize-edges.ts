import "dotenv/config";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Typy
interface GraphNode {
  id: string;
  title: string;
  text: string;
  tags?: string[];
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

interface GraphJSON {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface Style {
  name: string;
  description: string;
}

interface Styles {
  [key: string]: Style;
}

interface StylizedArticle {
  nodeId: string;
  style: string;
  title: string;
  text: string;
}

interface StylizedEdge {
  from: string;
  to: string;
  style: string;
  teaser: string;
  generatedAt: string;
}

// Konfiguracja
const OPENAI_MODEL = "gpt-4o-mini";

// Wczytaj graf
function loadGraph(graphPath: string): GraphJSON {
  const content = fs.readFileSync(graphPath, "utf-8");
  return JSON.parse(content);
}

// Wczytaj style
function loadStyles(stylesPath: string): Styles {
  const content = fs.readFileSync(stylesPath, "utf-8");
  return JSON.parse(content);
}

// Wczytaj stylizowane artykuły
function loadStylizedArticles(
  articlesDir: string
): Map<string, StylizedArticle> {
  const articles = new Map<string, StylizedArticle>();

  if (!fs.existsSync(articlesDir)) {
    return articles;
  }

  const files = fs.readdirSync(articlesDir);
  for (const file of files) {
    if (file.endsWith(".json") && !file.startsWith("_")) {
      const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
      const article = JSON.parse(content) as StylizedArticle;
      articles.set(article.nodeId, article);
    }
  }

  return articles;
}

// Generuj stylizowaną zajawkę dla krawędzi
async function stylizeEdge(
  openai: OpenAI,
  edge: GraphEdge,
  fromArticle: StylizedArticle | GraphNode,
  toArticle: StylizedArticle | GraphNode,
  style: Style,
  styleName: string
): Promise<StylizedEdge> {
  const fromTitle = fromArticle.title;
  const fromText = fromArticle.text;
  const toTitle = toArticle.title;
  const toText = toArticle.text;

  const prompt = `Stwórz krótką zajawkę/pytanie które zachęci użytkownika do przejścia z jednego artykułu do drugiego.

STYL ZAJAWKI: "${style.name}"
${style.description}

ARTYKUŁ ŹRÓDŁOWY (skąd użytkownik idzie):
Tytuł: "${fromTitle}"
Treść: "${fromText}"

ARTYKUŁ DOCELOWY (dokąd może przejść):
Tytuł: "${toTitle}"
Treść: "${toText}"

WYMAGANIA:
- Zajawka powinna mieć 10-15 słów
- Zachęć do kliknięcia i przejścia do następnego artykułu
- Użyj stylu: ${style.name}
- Zwróć JSON: { "teaser": "..." }`;

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message?.content || "{}";
  const result = JSON.parse(content);

  return {
    from: edge.from,
    to: edge.to,
    style: styleName,
    teaser: result.teaser || `${fromTitle} → ${toTitle}`,
    generatedAt: new Date().toISOString(),
  };
}

// Funkcja pomocnicza - generuj dla pojedynczego stylu krawędzi
async function generateForEdgeStyle(
  openai: OpenAI,
  graph: GraphJSON,
  nodeMap: Map<string, GraphNode>,
  stylizedArticles: Map<string, StylizedArticle>,
  edgeStyleName: string,
  edgeStyle: Style,
  articleStyleName: string,
  outputDir: string
): Promise<number> {
  const outputPath = path.resolve(
    import.meta.dirname,
    outputDir,
    "edges",
    `${articleStyleName}_${edgeStyleName}`
  );
  fs.mkdirSync(outputPath, { recursive: true });

  const allEdges: StylizedEdge[] = [];

  console.log(`\n🔗 [${edgeStyle.name}] Generowanie ${graph.edges.length} zajawek...`);

  for (let i = 0; i < graph.edges.length; i++) {
    const edge = graph.edges[i];
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);

    if (!fromNode || !toNode) {
      console.log(`  ⚠️ [${edgeStyleName}] Pominięto ${edge.from} → ${edge.to}`);
      continue;
    }

    console.log(`  [${edgeStyleName}] [${i + 1}/${graph.edges.length}] ${edge.from} → ${edge.to}`);

    const fromArticle = stylizedArticles.get(edge.from) || fromNode;
    const toArticle = stylizedArticles.get(edge.to) || toNode;

    try {
      const stylizedEdge = await stylizeEdge(
        openai,
        edge,
        fromArticle,
        toArticle,
        edgeStyle,
        edgeStyleName
      );
      allEdges.push(stylizedEdge);

      const edgePath = path.join(outputPath, `${edge.from}__${edge.to}.json`);
      fs.writeFileSync(edgePath, JSON.stringify(stylizedEdge, null, 2));

      console.log(`    ✓ "${stylizedEdge.teaser}"`);
    } catch (error) {
      console.error(`    ✗ Błąd:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const allPath = path.join(outputPath, "_all.json");
  fs.writeFileSync(allPath, JSON.stringify(allEdges, null, 2));

  console.log(`✅ [${edgeStyle.name}] Gotowe! ${allEdges.length} zajawek`);
  return allEdges.length;
}

// Główna funkcja
async function main() {
  const args = process.argv.slice(2);
  const graphPath = args[0] || "../../data/brama_florianska.json";
  const edgeStyleArg = args[1] || "all";
  const articleStyleName = args[2] || "adult";
  const outputDir = args[3] || "./output";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Brak OPENAI_API_KEY w zmiennych środowiskowych");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  const edgeStylesPath = path.join(import.meta.dirname, "edge-styles.json");
  const edgeStyles = loadStyles(edgeStylesPath);

  const resolvedGraphPath = path.resolve(import.meta.dirname, graphPath);
  const graph = loadGraph(resolvedGraphPath);

  console.log(`📚 Wczytano graf: ${graph.edges.length} krawędzi`);

  const articlesDir = path.resolve(import.meta.dirname, outputDir, articleStyleName);
  const stylizedArticles = loadStylizedArticles(articlesDir);

  if (stylizedArticles.size > 0) {
    console.log(`📝 Używam stylizowanych artykułów (${articleStyleName}): ${stylizedArticles.size}`);
  } else {
    console.log(`⚠️ Brak stylizowanych artykułów - używam oryginalnych`);
  }

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  // Wybierz style do wygenerowania
  let edgeStylesToGenerate: string[];
  if (edgeStyleArg === "all") {
    edgeStylesToGenerate = Object.keys(edgeStyles);
    console.log(`🚀 Generowanie równoległe dla stylów: ${edgeStylesToGenerate.join(", ")}`);
  } else {
    if (!edgeStyles[edgeStyleArg]) {
      console.error(`❌ Nieznany styl: ${edgeStyleArg}`);
      console.log(`Dostępne: ${Object.keys(edgeStyles).join(", ")}, all`);
      process.exit(1);
    }
    edgeStylesToGenerate = [edgeStyleArg];
    console.log(`🎨 Styl krawędzi: ${edgeStyles[edgeStyleArg].name}`);
  }

  const startTime = Date.now();
  const results = await Promise.all(
    edgeStylesToGenerate.map((edgeStyleName) =>
      generateForEdgeStyle(
        openai,
        graph,
        nodeMap,
        stylizedArticles,
        edgeStyleName,
        edgeStyles[edgeStyleName],
        articleStyleName,
        outputDir
      )
    )
  );

  const totalEdges = results.reduce((sum, count) => sum + count, 0);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ Wszystko gotowe!`);
  console.log(`📊 Wygenerowano ${totalEdges} zajawek w ${edgeStylesToGenerate.length} stylach`);
  console.log(`⏱️  Czas: ${duration}s`);
  console.log(`📁 Output: ${path.resolve(import.meta.dirname, outputDir, "edges")}`);
}

main().catch(console.error);

