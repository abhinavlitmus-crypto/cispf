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
    eyebrow: "Trade Opportunities",
    heading: "Canada-Indian Trade",
    description: "Two economies with complementary strengths. New corridors for goods and services are opening as trade ties deepen between Canada and India.",
    image: "/Image/placeholder-image-1.png",
    imageAlt: "Cargo ship at a Canadian port",
    href: "/#contact",
  },
  {
    id: "growth",
    eyebrow: "Growth Opportunities",
    heading: "Sectors With Growth Potential",
    description: "From manufacturing to advanced industry, shared priorities are creating new sectors for joint growth across both markets.",
    image: "/Image/placeholder-image-2.png",
    imageAlt: "Workers on a manufacturing floor",
    href: "/#contact",
  },
  {
    id: "investment",
    eyebrow: "Investment Opportunities",
    heading: "Investment Opportunities",
    description: "Two complementary economies. New avenues for capital. From critical resources and clean energy to technology and infrastructure, new opportunities are emerging across both markets.",
    image: "/Image/placeholder-image-1.png",
    imageAlt: "Person using a virtual reality headset",
    href: "/#contact",
  },
  {
    id: "partnership",
    eyebrow: "Partnership Opportunities",
    heading: "Partners in Progress",
    description: "Business leaders, investors and policymakers are building the relationships needed for sustained, long-term cross-border growth.",
    image: "/Image/placeholder-image-2.png",
    imageAlt: "Delegates seated in a conference hall",
    href: "/#contact",
  },
];
