import Projects from "./Projects";
import { getWpProjects } from "@/lib/wp";

export default async function ProjectsSection() {
  const wpProjects = await getWpProjects(3);
  return <Projects wpProjects={wpProjects} />;
}
