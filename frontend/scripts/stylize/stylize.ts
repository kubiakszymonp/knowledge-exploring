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

// BFS dla grafu
function getNodesInBFSOrder(graph: GraphJSON): GraphNode[] {
  const edgeMap = new Map<string, string[]>();
  graph.edges.forEach((edge) => {
    if (!edgeMap.has(edge.from)) edgeMap.set(edge.from, []);
    edgeMap.get(edge.from)!.push(edge.to);
  });

  const inDegree = new Map<string, number>();
  graph.nodes.forEach((node) => inDegree.set(node.id, 0));
  graph.edges.forEach((edge) => {
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  const roots = graph.nodes.filter((node) => (inDegree.get(node.id) || 0) === 0);
  if (roots.length === 0) return graph.nodes;

  const queue = [...roots];
  const visited = new Set<string>();
  const ordered: GraphNode[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node.id)) continue;

    visited.add(node.id);
    ordered.push(node);

    const neighbors = edgeMap.get(node.id) || [];
    neighbors.forEach((neighborId) => {
      const neighborNode = graph.nodes.find((n) => n.id === neighborId);
      if (neighborNode && !visited.has(neighborId)) {
        queue.push(neighborNode);
      }
    });
  }

  graph.nodes.forEach((node) => {
    if (!visited.has(node.id)) ordered.push(node);
  });

  return ordered;
}

// Generuj stylizowany artykuł
async function stylizeArticle(
  openai: OpenAI,
  node: GraphNode,
  rootNode: GraphNode,
  style: Style,
  styleName: string
): Promise<StylizedArticle> {
  const prompt = `Jesteś ekspertem od tworzenia treści w różnych stylach. Przeredaguj poniższy tekst zgodnie z instrukcjami stylu.

STYL: "${style.name}"
${style.description}

KONTEKST GŁÓWNY: "${rootNode.title}"

ORYGINALNY TEKST (tytuł: "${node.title}"):
"${node.text}"

WYMAGANIA:
- Zachowaj wszystkie kluczowe informacje
- Dostosuj język do stylu
- Możesz zmienić tytuł, żeby pasował do stylu
- Treść którą generujesz jest częścią większego artykułu, więc nie musisz podkreślać jakby był indywidalnym artykułem.
- Generując, zakładaj, że czytelnik jest przy obiekcie który opisujesz i już częściowi zna jego kontekst i wie czym jest
- Zwróć JSON: { "title": "...", "text": "..." }`;

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message?.content || "{}";
  const result = JSON.parse(content);

  return {
    nodeId: node.id,
    style: styleName,
    title: result.title || node.title,
    text: result.text || node.text,
    generatedAt: new Date().toISOString(),
  };
}

// Funkcja pomocnicza - generuj dla pojedynczego stylu
async function generateForStyle(
  openai: OpenAI,
  graph: GraphJSON,
  orderedNodes: GraphNode[],
  rootNode: GraphNode,
  styleName: string,
  style: Style,
  outputDir: string
): Promise<number> {
  const outputPath = path.resolve(import.meta.dirname, outputDir, styleName);
  fs.mkdirSync(outputPath, { recursive: true });

  const allArticles: StylizedArticle[] = [];

  console.log(`\n🎨 [${style.name}] Generowanie ${orderedNodes.length} artykułów...`);

  for (let i = 0; i < orderedNodes.length; i++) {
    const node = orderedNodes[i];
    console.log(`  [${styleName}] [${i + 1}/${orderedNodes.length}] ${node.title}...`);

    try {
      const article = await stylizeArticle(
        openai,
        node,
        rootNode,
        style,
        styleName
      );
      allArticles.push(article);

      const articlePath = path.join(outputPath, `${node.id}.json`);
      fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));

      console.log(`    ✓ Zapisano: ${node.id}.json`);
    } catch (error) {
      console.error(`    ✗ Błąd dla ${node.id}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const allPath = path.join(outputPath, "_all.json");
  fs.writeFileSync(allPath, JSON.stringify(allArticles, null, 2));

  console.log(`✅ [${style.name}] Gotowe! ${allArticles.length} artykułów`);
  return allArticles.length;
}

// Główna funkcja
async function main() {
  const args = process.argv.slice(2);
  const graphPath = args[0] || "../../data/brama_florianska.json";
  const styleArg = args[1] || "all";
  const outputDir = args[2] || "./output";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Brak OPENAI_API_KEY w zmiennych środowiskowych");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  const stylesPath = path.join(import.meta.dirname, "styles.json");
  const styles = loadStyles(stylesPath);

  const resolvedGraphPath = path.resolve(import.meta.dirname, graphPath);
  const graph = loadGraph(resolvedGraphPath);

  console.log(`📚 Wczytano graf: ${graph.nodes.length} węzłów`);

  const orderedNodes = getNodesInBFSOrder(graph);
  const rootNode = orderedNodes[0];
  console.log(`🌳 Root: ${rootNode.title}`);

  // Wybierz style do wygenerowania
  let stylesToGenerate: string[];
  if (styleArg === "all") {
    stylesToGenerate = Object.keys(styles);
    console.log(`🚀 Generowanie równoległe dla wszystkich stylów: ${stylesToGenerate.join(", ")}`);
  } else {
    if (!styles[styleArg]) {
      console.error(`❌ Nieznany styl: ${styleArg}`);
      console.log(`Dostępne style: ${Object.keys(styles).join(", ")}, all`);
      process.exit(1);
    }
    stylesToGenerate = [styleArg];
    console.log(`🎨 Generowanie dla stylu: ${styles[styleArg].name}`);
  }

  // Generuj równolegle dla wszystkich stylów
  const startTime = Date.now();
  const results = await Promise.all(
    stylesToGenerate.map((styleName) =>
      generateForStyle(
        openai,
        graph,
        orderedNodes,
        rootNode,
        styleName,
        styles[styleName],
        outputDir
      )
    )
  );

  const totalArticles = results.reduce((sum, count) => sum + count, 0);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ Wszystko gotowe!`);
  console.log(`📊 Wygenerowano ${totalArticles} artykułów w ${stylesToGenerate.length} stylach`);
  console.log(`⏱️  Czas: ${duration}s`);
  console.log(`📁 Output: ${path.resolve(import.meta.dirname, outputDir)}`);
}

main().catch(console.error);


