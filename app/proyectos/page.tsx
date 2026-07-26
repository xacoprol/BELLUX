import type { Metadata } from "next";
import ProjectsArchive from "@/components/ProjectsArchive";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getWpProjects } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Proyectos | Bellux Entertainment",
  description:
    "Espetáculos, animações e produções Bellux — hotéis, Natal, palco e eventos.",
};

export default async function ProyectosPage() {
  const wpProjects = await getWpProjects(40);

  return (
    <>
      <main>
        <ProjectsArchive wpProjects={wpProjects} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
