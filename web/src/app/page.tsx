import Hero from "@/components/sections/home/Hero/Hero";
import About from "@/components/sections/home/About/About";
import JoinUs from "@/components/sections/home/JoinUs/JoinUs";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
      </main>
      <JoinUs />
    </>
  );
}
