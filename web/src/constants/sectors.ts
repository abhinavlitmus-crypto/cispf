export type Sector = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type SectorCorridor = {
  id: string;
  from: string;
  to: string;
  image: string;
  imageMobile: string;
  imageAlt: string;
  align: "start" | "end";
  sectors: Sector[];
};

export const sectorCorridors: SectorCorridor[] = [
  { id: "canada-to-india", from: "CANADA", to: "INDIA", image: "/Image/opportunities-section-2-image-1.jpg", imageMobile: "/Image/opportunities-section-2-image-1-mobile.jpg", imageAlt: "Growers reviewing produce in a greenhouse", align: "start", sectors: [
    { id: "agriculture", title: "Agriculture", description: "Food, supply chains & cold-chain technology", icon: "/Icon/Plant.svg" },
    { id: "clean-technology", title: "Clean Technology", description: "Water, waste & renewable energy", icon: "/Icon/Technology.svg" },
    { id: "ai-machine-learning", title: "AI & Machine Learning", description: "Technology for India’s digital economy", icon: "/Icon/Network.svg" },
    { id: "infrastructure", title: "Infrastructure", description: "Transport, logistics & urban development", icon: "/Icon/Infrastructure.svg" },
    { id: "advanced-services", title: "Advanced Services", description: "Education, aviation & professional services", icon: "/Icon/Services.svg" },
  ] },
  { id: "india-to-canada", from: "INDIA", to: "CANADA", image: "/Image/opportunities-section-2-image-2.webp", imageMobile: "/Image/opportunities-section-2-image-2-mobile.jpg", imageAlt: "Professional using a virtual reality headset", align: "end", sectors: [
    { id: "technology-engineering", title: "Technology & Engineering", description: "Skilled talent for Canada’s innovation economy", icon: "/Icon/Gare.svg" },
    { id: "fintech-digital-infrastructure", title: "Fintech & Digital Infrastructure", description: "Proven digital models with global potential", icon: "/Icon/Digital.svg" },
    { id: "renewable-energy", title: "Renewable Energy", description: "Expertise for Canada’s clean energy transition", icon: "/Icon/Windmill.svg" },
  ] },
];
