import Services from "./Services";
import { getWpServices } from "@/lib/wp";

export default async function ServicesSection() {
  const wpServices = await getWpServices();
  return <Services wpServices={wpServices} />;
}
