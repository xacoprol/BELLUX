import HeroSection from "@/components/HeroSection";
import Manifesto from "@/components/Manifesto";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import Testimonials from "@/components/Testimonials";
import InstagramSection from "@/components/InstagramSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <Manifesto />
        <ServicesSection />
        <ProjectsSection />
        <Testimonials />
        <InstagramSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
