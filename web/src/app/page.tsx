import Hero from "@/components/sections/home/Hero/Hero";
import About from "@/components/sections/home/About/About";
import Opportunities from "@/components/sections/home/Opportunities/Opportunities";
import Opportunity from "@/components/sections/home/Opportunity/Opportunity";
import NewsMedia from "@/components/sections/home/NewsMedia/NewsMedia";
import Subscribe from "@/components/sections/home/Subscribe/Subscribe";
import JoinUs from "@/components/sections/home/JoinUs/JoinUs";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Opportunities />
        <Opportunity videoSrc="/videos/home-section-3.mp4" />
        <NewsMedia />
        <Subscribe />
      </main>
      <JoinUs />
    </>
  );
}
