import Hero from "./Hero";
import { getWpClients } from "@/lib/wp";

export default async function HeroSection() {
  const wpClients = await getWpClients();
  return <Hero wpClients={wpClients} />;
}
