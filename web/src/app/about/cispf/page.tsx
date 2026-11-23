import type { Metadata } from "next";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import HeroSection from "@/components/about/cispf/HeroSection";
import ThreePillars from "@/components/about/cispf/ThreePillars";
import WhoWeAre from "@/components/about/cispf/Whoweare";
import StickyImage from "@/components/about/cispf/StickyImage";
import OurStory from "@/components/about/cispf/OurStory";
import OurApproach from "@/components/about/cispf/OurApproach";
export const metadata: Metadata = {
  title: "About CISPF | Canada-India Strategic Partnership Forum",
  description: "The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity.",
};

export default function AboutCispfPage() {
  return (
    <>
      <main>
        <HeroSection />
        <ThreePillars />
        <WhoWeAre />
        <StickyImage image="/about/stick1.jpg" />
        <OurStory />
        <StickyImage image="/about/stick2.jpg" />
        <OurApproach />
        <JoinUs />
      </main>
    </>
  );
}
