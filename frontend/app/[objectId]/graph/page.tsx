import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ objectId: string }>;
}

/**
 * Strona grafu zastąpiona listą miejsc (bez pojęcia grafu w modelu pilota).
 */
export default async function GraphPage({ params }: PageProps) {
  await params;
  redirect("/places");
}
