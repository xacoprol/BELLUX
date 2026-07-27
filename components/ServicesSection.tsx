import Services from "./Services";
import { getWpServices } from "@/lib/wp";
import type { Locale } from "@/lib/i18n/types";

export default async function ServicesSection({
  locale = "pt",
}: {
  locale?: Locale;
}) {
  const wpServices = await getWpServices(12, locale);
  return <Services wpServices={wpServices} />;
}
