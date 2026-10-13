import { FolderProjects } from "@/components/FolderProjects";
import { Nav } from "@/components/Nav";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center pt-20 pb-12">
        <FolderProjects />
      </main>
      <WhatsAppButton />
    </>
  );
}