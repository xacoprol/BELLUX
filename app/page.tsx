import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <div className="s-rule" />
        <About />
        <div className="s-rule" />
        <Services />
        <div className="s-rule" />
        <Clients />
        <div className="s-rule" />
        <Testimonials />
        <div className="s-rule" />
        <Projects />
        <div className="s-rule" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
