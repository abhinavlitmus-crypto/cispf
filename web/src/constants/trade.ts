export type TradeStat = {
  id: string;
  value: string;
  label: string;
  icon: string;
};

export type TradeStatGroup = {
  id: string;
  title: string;
  stats: TradeStat[];
};

const icons = {
  exchange: "/Icon/Currency Exchange.svg",
  export: "/Icon/Export.svg",
  import: "/Icon/Import.svg",
  trade: "/Icon/Trade.svg",
  shopping: "/Icon/shopping.svg",
};

export const tradeStatGroups: TradeStatGroup[] = [
  { id: "trade-2024", title: "TRADE IN 2024", stats: [
    { id: "bilateral-2024", value: "$30.9B", label: "Bilateral trade", icon: icons.exchange },
    { id: "services-exports-2024", value: "$16.1B", label: "Canadian services exports to India", icon: icons.export },
    { id: "services-imports-2024", value: "$3.5B", label: "Canadian services imports from India", icon: icons.import },
  ] },
  { id: "trade-2025", title: "TRADE IN 2025", stats: [
    { id: "merchandise-trade-2025", value: "$13.6B", label: "Two-way merchandise trade in 2025.", icon: icons.trade },
    { id: "merchandise-imports-2025", value: "$9.7B", label: "Merchandise imports from India.", icon: icons.shopping },
    { id: "services-exports-2025", value: "$15.2B", label: "Canada’s service exports to India.", icon: icons.export },
    { id: "services-imports-2025", value: "$4.5B", label: "Service imports from India, up 3%.", icon: icons.import },
  ] },
];
