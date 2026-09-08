import Hero from "@/components/sections/home/Hero/Hero";
import About from "@/components/sections/home/About/About";
import Subscribe from "@/components/sections/home/Subscribe/Subscribe";
import JoinUs from "@/components/sections/home/JoinUs/JoinUs";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Subscribe />
      </main>
      <JoinUs />
    </>
  );
}
