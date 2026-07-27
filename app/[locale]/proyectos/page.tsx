import type { Metadata } from "next";
import ProjectsArchive from "@/components/ProjectsArchive";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getWpProjects } from "@/lib/wp";
import { content } from "@/lib/i18n/content";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const meta = content[locale].meta;
  return buildPageMetadata({
    locale,
    title: meta.projectsTitle,
    description: meta.projectsDescription,
    path: "/proyectos",
  });
}

export default async function ProyectosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const wpProjects = await getWpProjects(40, locale);

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
