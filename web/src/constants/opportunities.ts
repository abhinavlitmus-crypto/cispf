// Placeholder images and hover copy for Trade/Growth/Partnership. Replace when the design team supplies them.
export type OpportunityItem = {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const opportunityItems: OpportunityItem[] = [
  {
    id: "trade",
    eyebrow: "TRADE",
    heading: "Current Trade",
    description: "$30.9B in bilateral trade. A much larger opportunity ahead. From agriculture and energy to pharmaceuticals and machinery, the foundations for deeper trade already exist.",
    image: "/Image/home-trade.webp",
    imageAlt: "Cargo ship at a Canadian port",
    href: "/opportunities#current-trade",
  },
  {
    id: "investment",
    eyebrow: "INVESTMENT",
    heading: "Current Investment",
    description: "Two complementary economies. New avenues for capital. From critical resources and clean energy to technology and infrastructure, new opportunities are emerging across both markets.",
    image: "/Image/home-investment.webp",
    imageAlt: "Person using a virtual reality headset",
    href: "/opportunities#investment",
  },
  {
    id: "growth",
    eyebrow: "GROWTH",
    heading: "Sectors with Potential",
    description: "Where Canadian expertise meets Indian scale. AI, clean technology, agriculture, infrastructure and advanced services are opening new pathways for cross-border growth.",
    image: "/Image/home-growth.webp",
    imageAlt: "Workers on a manufacturing floor",
    href: "/opportunities#growth-sectors",
  },
  {
    id: "partnership",
    eyebrow: "PROVINCES",
    heading: "Provinces in the Play",
    description: "The right conversations can change the trajectory. CISPF convenes business, government and policy leaders around the questions that will shape Canada–India relations.",
    image: "/Image/home-provinces.webp",
    imageAlt: "Delegates seated in a conference hall",
    href: "/opportunities#partners",
  },
];
