import Hero from "@/components/sections/home/Hero/Hero";
import About from "@/components/sections/home/About/About";
import Opportunities from "@/components/sections/home/Opportunities/Opportunities";
import PolicyDiscussions from "@/components/sections/home/PolicyDiscussions/PolicyDiscussions";
import Opportunity from "@/components/sections/home/Opportunity/Opportunity";
import NewsMedia from "@/components/sections/home/NewsMedia/NewsMedia";
import Subscribe from "@/components/sections/home/Subscribe/Subscribe";
import Events from "@/components/sections/home/Events/Events";
import JoinUs from "@/components/sections/home/JoinUs/JoinUs";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Opportunities />
        <PolicyDiscussions />
        <Opportunity />
        {/* <NewsMedia /> */}
        <Subscribe />
        <Events />
      </main>
      <JoinUs />
    </>
  );
}
