import type { Metadata } from "next";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import OpportunitiesHero from "@/components/sections/opportunities/OpportunitiesHero/OpportunitiesHero";
import CurrentTrade from "@/components/sections/opportunities/CurrentTrade/CurrentTrade";
import GrowthSectors from "@/components/sections/opportunities/GrowthSectors/GrowthSectors";
import InvestmentOpportunities from "@/components/sections/opportunities/InvestmentOpportunities/InvestmentOpportunities";
import PartnersInProgress from "@/components/sections/opportunities/PartnersInProgress/PartnersInProgress";

export const metadata: Metadata = {
  title: "Opportunities | Canada-India Strategic Partnership Forum",
  description: "Explore opportunities across the Canada–India partnership.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <main>
        <OpportunitiesHero />
        <CurrentTrade />
        <GrowthSectors />
        <InvestmentOpportunities />
        <PartnersInProgress />
        <JoinUs />
      </main>
    </>
  );
}
