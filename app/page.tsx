import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import ProjectsSection from "@/components/ProjectsSection";
import Testimonials from "@/components/Testimonials";
import InstagramSection from "@/components/InstagramSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <ProjectsSection />
        <Testimonials />
        <InstagramSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
