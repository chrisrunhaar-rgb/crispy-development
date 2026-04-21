import HomeContent from "./HomeContent";
import { getGeoInfo } from "@/lib/geo";

export default async function HomePage() {
  const geo = await getGeoInfo();
  return <HomeContent geo={geo} />;
}
