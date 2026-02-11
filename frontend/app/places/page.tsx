import { getEntities } from "@/lib/api/pilot";
import { PlacesClient } from "./PlacesClient";

export default async function PlacesPage() {
  const entities = await getEntities();
  const places = entities.filter((e) => e.type === "place");

  return <PlacesClient places={places} />;
}
