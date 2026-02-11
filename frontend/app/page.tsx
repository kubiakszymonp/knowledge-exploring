import { getEntities, getRoutes } from "@/lib/api/pilot";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  const [entities, routes] = await Promise.all([
    getEntities(),
    getRoutes(),
  ]);
  const places = entities.filter((e) => e.type === "place");
  const recommendedRoutes = routes.slice(0, 3);

  return (
    <HomeClient
      places={places}
      recommendedRoutes={recommendedRoutes}
    />
  );
}
