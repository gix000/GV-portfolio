import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <ProjectGrid />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}