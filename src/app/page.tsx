import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectGrid } from "@/components/ProjectGrid";
import { FolderProjects } from "@/components/FolderProjects";
import { Contact } from "@/components/Contact";
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
        <FolderProjects />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}