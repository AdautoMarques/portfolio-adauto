import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experimente from "@/components/Experimente";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Hero />
      <Projects />
    </main>
  );
}
