import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Projects />
        <Clients />
        <div className="s-rule" />
        <Testimonials />
        <div className="s-rule" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
