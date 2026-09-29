export type InvestmentArea = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const investmentAreas: InvestmentArea[] = [
  { id: "critical-resources", title: "Critical Resources", description: "Building resilient supply chains.", icon: "/Icon/Resources-red.svg" },
  { id: "technology-ai", title: "Technology & AI", description: "Backing innovation at scale.", icon: "/Icon/Network-red.svg" },
  { id: "clean-energy", title: "Clean Energy", description: "Investing in the transition.", icon: "/Icon/Technology-red.svg" },
  { id: "infrastructure", title: "Infrastructure", description: "Building for long-term growth.", icon: "/Icon/Graph-red.svg" },
];
