import { getEntities } from "@/lib/api/pilot";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  const entities = await getEntities();
  const places = entities.filter((e) => e.type === "place");

  return <HomeClient places={places} />;
}
