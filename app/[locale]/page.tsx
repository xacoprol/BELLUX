import HeroSection from "@/components/HeroSection";
import Manifesto from "@/components/Manifesto";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import Testimonials from "@/components/Testimonials";
import InstagramSection from "@/components/InstagramSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <>
      <main>
        <HeroSection />
        <Manifesto />
        <ServicesSection locale={locale} />
        <ProjectsSection locale={locale} />
        <Testimonials />
        <InstagramSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
