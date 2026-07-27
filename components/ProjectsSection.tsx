import Projects from "./Projects";
import { getWpProjects } from "@/lib/wp";
import type { Locale } from "@/lib/i18n/types";

export default async function ProjectsSection({
  locale = "pt",
}: {
  locale?: Locale;
}) {
  const wpProjects = await getWpProjects(3, locale);
  return <Projects wpProjects={wpProjects} />;
}
