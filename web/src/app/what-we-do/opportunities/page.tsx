import type { Metadata } from "next";
import OpportunitiesHero from "@/components/sections/opportunities/OpportunitiesHero/OpportunitiesHero";

export const metadata: Metadata = {
  title: "Opportunities | Canada-India Strategic Partnership Forum",
  description: "Explore opportunities across the Canada–India partnership.",
};

export default function OpportunitiesPage() {
  return (
    <main>
      <OpportunitiesHero />
    </main>
  );
}
