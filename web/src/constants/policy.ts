export type PolicyItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href: string;
  detailTitle?: string;
  subtitle?: string;
  author?: { name: string; role: string };
  detailImage?: string;
  detailImageAlt?: string;
  references?: string[];
  sections?: PolicySection[];
};

// A number is a source: it points at that position (starting from 1) in the item's references.
export type PolicyText = (string | number)[];

export type PolicyBlock =
  | { type: "text"; heading?: string; boxed?: boolean; paragraphs: PolicyText[] }
  | { type: "list"; heading: string; items: string[] };

export type PolicySection = {
  title: string;
  note?: string;
  blocks: PolicyBlock[];
};

const icrierReport = "https://icrier.org/pdf/De-risking-Fertiliser-Supplies-for-India-amid-Rising-Geopolitical-Risks.pdf";
const takshashilaReport = "https://takshashila.org.in/content/publications/assets/20260402-Fertilizer-Geopolitics.pdf";
const pibPotashRelease = "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220415&reg=3&lang=2";

const potashReferences = [
  icrierReport,
  takshashilaReport,
  "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281352&reg=48&lang=1",
  "https://natural-resources.canada.ca/minerals-mining/mining-data-statistics-analysis/minerals-metals-facts/potash-facts#L4",
  "https://oec.world/en/profile/bilateral-product/potassic-fertilizers/reporter/usa",
  takshashilaReport,
  icrierReport,
  pibPotashRelease,
  "https://fertilizercanada.ca/economic-impact-report-2020/global-use-and-export/",
  "https://csdronline.com/wp-content/uploads/2026/08/From-Trade-to-Strategic-Partnership_CSDR-ICRI-Aug-2026.pdf",
  "https://www.canada.ca/en/natural-resources-canada/news/2026/01/minister-hodgson-strengthens-energy-and-mining-partnerships-with-india.html",
  "https://www.nature.com/articles/s41598-020-79883-x",
  pibPotashRelease,
  "https://www.canpotex.com/news/canpotex-signs-mous-india-customers/",
  "https://www.dentons.com/en/insights/newsletters/2026/june/18/infrastructure-and-major-projects-perspectives/canada-and-india",
  "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/india-inde/cepa-apeg/negotiations.aspx?lang=eng",
];

const potashSections: PolicySection[] = [
  {
    title: "Executive Summary",
    blocks: [
      {
        type: "text",
        paragraphs: [
          ["Geopolitical volatility in the Gulf region has drawn acute attention to the importance of a sustainable fertilizer supply for India. Resilience and reliability of supply chains are becoming critical in the trade of commodities like fertilizers. Sourcing it is not a commodity procurement question but a food security imperative because it impacts agricultural productivity of a populous nation. Hence, it should be viewed through a strategic lens rather than merely a transactional resource."],
          ["Among fertilizer inputs, potash is one component where India is entirely import-dependent. Canada is one of the important sources of potash for India. Nearly 25% of India’s potash requirement is fulfilled by Canada. However, the trade relationship has remained strictly transactional subjecting it to uncertainty."],
          ["To shift potash trade from transactional to strategic, Canada and India would need to transition the policy architecture to lean towards an institutionalized long-term partnership. This means, a government-supported framework for predictability that can facilitate multi-year commercial arrangements, with risk-sharing, coordinated logistics, and upstream investment. Canada and India should use the ongoing Comprehensive Economic Partnership Agreement (CEPA) negotiations to establish a dedicated framework for potash cooperation."],
        ],
      },
    ],
  },
  {
    title: "Problem Statement",
    blocks: [
      {
        type: "text",
        paragraphs: [
          ["India is entirely dependent on imports for Muriate of Potash (MOP), as the country has virtually no viable potash deposits. In 2024-25, the direct MOP consumption was about 2.2 MMT, while imports reached 3.54 MMT.", 1, " MOP is largely imported from Canada, Russia, Belarus and Jordan. While the transit times from Canada are longer,", 2, " the other options for India have been fraught with risks and disruptions due to geopolitical shocks, posing a threat to India’s food security.", 3, " Hence, fortifying and strengthening MOP supply is a strategic necessity for India."],
          ["Canada is the leading potash supplier in the world. The primary destination for its potash export is the United States - 53% of its total exports in 2024 were for the US.", 4, " For the United States, this amount constitutes over 80% of its total potash imports.", 5, " However, with the Trump administration’s tariffs against the country and the threat of annexation, Canada is on a path of diversification to reduce its dependence on the US."],
          ["These circumstances provide both Canada and India a strategic opportunity to further deepen the bilateral fertilizer trade engagement. Realizing this potential, though, requires transitioning the relationship from transactional to a long-term, sustainable partnership."],
        ],
      },
    ],
  },
  {
    title: "Background",
    blocks: [
      {
        type: "text",
        paragraphs: [
          ["India’s agricultural security relies on sustainable fertilizer access. India consumes 60 million tonnes of fertilizer per year, of which 18 million or 30% is imported.", 6, " Even in its domestic production of fertilizer, India is dependent on global supply chains for intermediary products bringing its fertilizer dependency on global supply chains to nearly 68 -70 percent.", 7, " Potash is a key ingredient in the NPK fertilizer mix needed in India."],
          ["India imports most of its potash and phosphatic fertilizers. Between 2022 and 2025, India imported almost 25% of total muriate of potash (MOP) from Canada, underscoring Canada’s role as a strategic supplier.", 8],
          ["The fertilizer industry plays an essential role in Canada’s economy, contributing over $42 billion. Canada is the world’s leading supplier of potash with 95% of Canadian potash being exported. Canadian potash is one of the most sustainable in the world producing some of the lowest GHG emissions.", 9, " The province of Saskatchewan alone accounts for a major share of global potash production.", 10],
          ["Currently, the US is Canada’s largest fertilizer market, accounting for well over half of all fertilizer exports each year."],
          ["As stated by Canada, its relationship with India is key to achieving the Prime Minister Mark Carney’s goal of doubling exports to non-US markets by 2035.", 11],
          ["Hence, Canada’s objective is export-market diversification, whereas India’s objective is reliable, resilient, and affordable potash access; these goals overlap even if they are not equivalent."],
        ],
      },
    ],
  },
  {
    title: "Methodology",
    blocks: [
      {
        type: "text",
        paragraphs: [
          ["The key findings and recommendations in this brief drew upon academic studies, government reports, trade data, and policy documents. This literature review was supplemented by insights shared during an expert webinar titled “Beyond buyer-seller: Canada-India strategic investments in potash for mutual growth and supply security.” The Canadian arm of the US-India Strategic Partnership Forum (USISPF), now registered as the Canada-India Strategic Partnership Forum (CISPF) and the Alberta India Chamber of Commerce organized this event on May 11, 2026."],
        ],
      },
      {
        type: "list",
        heading: "The webinar featured a panel of six subject matter experts:",
        items: [
          "Masakui Runsung, India’s Consul General in Vancouver",
          "Rohit Kumar Singh, Chair of the Global Value Chains Committee and Advisor to the Board of Directors, former Secretary to the Government of India",
          "Swapnika Rachapalli, Assistant Professor, Strategy and Business Economics Division, UBC Sauder School of Business",
          "Jeet Jheetey, COO, Clean Seed",
          "Matthew Don Trapp, Director of Government Relations, Fertilizer Canada",
          "Anupam Srivastav, President, Alberta India Chamber of Commerce",
        ],
      },
      {
        type: "list",
        heading: "The webinar and subsequent analysis largely focused on these themes:",
        items: [
          "Tangible collaborations as foundations for lasting partnership between Canada and India.",
          "Equity participation as a mechanism for long-term strategic alignment.",
          "Government policies that enable cross-border investment and strategic resource partnerships.",
          "Viable pathways for institutionalizing partnerships.",
          "Ground-level realities of navigating regulation, commercial viability, and execution.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          ["A limitation of this methodology was that the analysis relied on a small and intentionally selected group of experts. The recommendations are also primarily based on the discussion."],
        ],
      },
    ],
  },
  {
    title: "Key Findings",
    blocks: [
      {
        type: "text",
        heading: "India’s potash vulnerability and need for supply security",
        paragraphs: [
          ["India’s position in the global potash market reveals critical vulnerabilities. Rohit Kumar Singh highlighted India’s significant dependence on imported potash and the large gap between current potash use and what would be required under a more balanced plant-nutrient regime. Singh explained that India’s fertilizer consumption has historically been skewed towards nitrogen, influenced in part by relative pricing and subsidy structures, with consequences for balanced nutrient application and agricultural productivity. Studies have shown a significant increase in the yield of wheat and rice under a more balanced fertilizer regime.", 12, " Improving nutrient balance, he argued, would require both policy reform and reliable long-term access to potash."],
        ],
      },
      {
        type: "text",
        heading: "Case for Canada-India partnership on potash",
        paragraphs: [
          ["Canada possesses substantial potash reserves and established production infrastructure, positioning it as a reliable, long-term supplier. Companies such as Nutrien, Mosaic, and BHP, with its Jansen mine, are actively expanding capacity as per Fertilizer Canada. Moreover, Matthew Don Trapp underlined that Canadian potash production generates 50 percent less carbon emissions compared to Russian and Belarusian alternatives. This positions Canada as a sustainable, and democratically aligned supplier for India, a critical factor when sourcing in the current environment comes with geopolitical weight."],
        ],
      },
      {
        type: "text",
        heading: "On-ground policy constraints",
        paragraphs: [
          ["Despite the strategic rationale, significant barriers impede deeper cooperation. Saskatchewan-based Clean Seed’s partnership with one of the leading corporate establishments in India, Mahindra, presents an example that showcases effective collaboration along with lessons learned. The partnership demonstrates that Canadian innovation can scale effectively when localized through Indian partners. However, a persistent constraint for Canadian companies operating in India is often the federal-state governance structure regarding agriculture and fertilizer distribution. While the central government manages subsidies and imports, state governments oversee distribution and extension services, leading to inconsistencies in policy implementation. Jeet Jheetey said that addressing these challenges requires an explicit risk-sharing framework between government(s) and private sector actors. As per Swapnika Rachapalli, academic analysis also supports the need for structured relationships. Supply relationships built on trust and contractual longevity demonstrate greater resilience to external shocks. Policy uncertainty and the absence of relational contracts lead to underinvestment, elevated search costs, and in some cases, degraded trade quality."],
        ],
      },
    ],
  },
  {
    title: "Recommendations",
    note: "Directed towards the Governments of India and Canada for providing the enabling framework, and to private entities for implementation.",
    blocks: [
      {
        type: "text",
        heading: "Treat potash as an asset rather than a commodity",
        paragraphs: [
          ["Potash must be understood as a strategic asset, not merely a commodity. Supply chain resilience, rather than cost minimization, must anchor India’s procurement doctrine. Hence, some specific policy instruments and commercial mechanisms recommended to achieve supply chain stability through partnership with Canada are :"],
        ],
      },
      {
        type: "text",
        heading: "Policy instruments",
        boxed: true,
        paragraphs: [
          ["a) Risk-sharing framework: Establishing risk-sharing on aspects like price, production, transport, and financing between the government and private entities. Contracts could combine minimum offtake guarantees, price bands, force majeure provisions, insurance, contingency-stock obligations, and transparent renegotiation triggers. This step will need the government’s active involvement."],
          ["b) Indian equity participation in upstream Canadian potash assets: This can hedge the country against supply chain disruptions and help in decoupling from global price spikes under geopolitical turmoil. However, this comes with challenges like procuring viable capital. Here’s the example of Karnalyte Resources’ Wynyard Project where the Gujarat State Fertilizer and Chemicals has a 47.73% stake in upstream mining,", 13, " but the project has been delayed primarily due to financing."],
          ["c) Coordinated logistics planning across Canadian and Indian port infrastructure: This will form the foundation for achieving seamless movement of the commodity highlighting its progression from mere procurement to strategic. This infrastructure coordination is necessary to bypass global supply chain bottlenecks."],
        ],
      },
      {
        type: "text",
        heading: "Commercial mechanism",
        boxed: true,
        paragraphs: [
          ["a) Long-term supply agreements: Canpotex’s mid-term supply arrangement with Indian entities such as Coromandel International and Chambal Fertilizers,", 14, " can form a template for long-term engagements spanning 5-10 years between private entities. Private entities, including Canadian potash exporters, Indian importers, financial institutions and insurers should lead the commercial implementation of the partnership."],
        ],
      },
      {
        type: "text",
        heading: "Formalizing the shift by institutionalizing the partnership",
        paragraphs: [
          ["A formal embedding of potash supply security within the active Comprehensive Economic Partnership Agreement (CEPA) negotiation framework between Prime Ministers Carney and Modi was recommended during the webinar. This action would elevate fertilizer from a standard trade line item to a foundational pillar of the broader strategic partnership."],
          ["India and Canada are actively negotiating CEPA. They are expected to sign the agreement by the end of 2026.", 15, " CEPA should be utilized to institutionalize fertilizer security by establishing a dedicated Potash Cooperation section. Creating a distinct CEPA section that recognizes MOP as a strategic asset, rather than categorizing it under agriculture, would facilitate the formation of a multistakeholder working group. This group, comprising federal/central government, provincial/state governments, First Nations, producers, importers, port authorities, and financial institutions, could then develop principles for multi-year agreements. Provisions should be aimed at supporting transparent pricing, regulatory cooperation, sustainability standards, conditional yet minimum long-term offtake commitments and emergency allocation protocols. Annual consultations could review key indicators of progress and success such as volumes, affordability, inventory coverage, investment progress, and supply risks."],
          ["The Canadian government states that in negotiating a CEPA with India, its objective is to create opportunities and benefits for Canadian businesses, workers and families by reducing barriers to trade, and creating rules that will enhance predictability for traders.", 16, " For India, as well, predictability of potash supply is critical; hence, the CEPA agreement must aim at supporting the potash partnership."],
        ],
      },
    ],
  },
];

// Replace the contact links as the remaining discussion detail pages are added.
const discussions: PolicyItem[] = [
  { id: "potash-partnership", title: "Beyond Buyer–Seller: Enhancing the Canada-India Potash Partnership", date: "2026-05-11", dateLabel: "May 11, 2026", image: "/Policy Discussion/policy-discussion-image-1.png", imageAlt: "Speaker line-up for the Canada–India potash partnership discussion", href: "/what-we-do/policy-discussions/potash-partnership", detailTitle: "Beyond Buyer-Seller", subtitle: "Enhancing the Canada-India Potash Partnership", author: { name: "Maha Siddiqui", role: "Director, Policy and Strategy, Canada-India Strategic Partnership Forum (CISPF)" }, detailImage: "/Policy Discussion/policy-discussion-internal-image.png", detailImageAlt: "Potash stockpiles and rail cars beside a port at sunset, with crop fields in the foreground", references: potashReferences, sections: potashSections },
  { id: "calgary-stampede-roundtable", title: "India Roundtable at Calgary Stampede", date: "2026-06-04", dateLabel: "June 4, 2026", image: "/Policy Discussion/policy-discussion-image-2.png", imageAlt: "Delegates in conversation at the Calgary Stampede", href: "/#contact" },
  { id: "senior-leaders-policy-coordination", title: "Senior leaders examined renewed policy coordination, institutional trust, trade, investment, talent mobility and community ties.", date: "2026-05-11", dateLabel: "May 11, 2026", image: "/Policy Discussion/policy-discussion-image-3.png", imageAlt: "Speaker addressing an audience", href: "/#contact" },
];

const [potash, calgary, seniorLeaders] = discussions;

// Home section order: portrait, landscape, portrait.
export const policyItems: PolicyItem[] = [seniorLeaders, potash, calgary];

export const policyDiscussionItems: PolicyItem[] = discussions;
