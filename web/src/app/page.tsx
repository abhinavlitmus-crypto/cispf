import Hero from "@/components/sections/home/Hero/Hero";
import About from "@/components/sections/home/About/About";
import Opportunities from "@/components/sections/home/Opportunities/Opportunities";
import PolicyDiscussions from "@/components/sections/home/PolicyDiscussions/PolicyDiscussions";
import Opportunity from "@/components/sections/home/Opportunity/Opportunity";
import NewsMedia from "@/components/sections/home/NewsMedia/NewsMedia";
import Subscribe from "@/components/sections/home/Subscribe/Subscribe";
import Events from "@/components/sections/home/Events/Events";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import { getEvents, getPolicyDiscussionsPage } from "@/lib/content";

// Re-read admin portal content at most every 5 minutes.
export const revalidate = 300;

export default async function Home() {
  const [events, { discussions }] = await Promise.all([getEvents(), getPolicyDiscussionsPage()]);

  return (
    <>
      <main>
        <Hero />
        <About />
        <Opportunities />
        <PolicyDiscussions items={discussions} />
        <Opportunity />
        {/* <NewsMedia /> */}
        <Subscribe />
        <Events events={events} />
      </main>
      <JoinUs />
    </>
  );
}
