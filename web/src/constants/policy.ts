export type PolicyItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href: string;
};

// Replace the contact links when discussion detail pages exist.
const discussions: PolicyItem[] = [
  { id: "potash-partnership", title: "Beyond Buyer–Seller: Enhancing the Canada-India Potash Partnership", date: "2026-05-11", dateLabel: "May 11, 2026", image: "/Policy Discussion/policy-discussion-image-1.png", imageAlt: "Speaker line-up for the Canada–India potash partnership discussion", href: "/#contact" },
  { id: "calgary-stampede-roundtable", title: "India Roundtable at Calgary Stampede", date: "2026-06-04", dateLabel: "June 4, 2026", image: "/Policy Discussion/policy-discussion-image-2.png", imageAlt: "Delegates in conversation at the Calgary Stampede", href: "/#contact" },
  { id: "senior-leaders-policy-coordination", title: "Senior leaders examined renewed policy coordination, institutional trust, trade, investment, talent mobility and community ties.", date: "2026-05-11", dateLabel: "May 11, 2026", image: "/Policy Discussion/policy-discussion-image-3.png", imageAlt: "Speaker addressing an audience", href: "/#contact" },
];

const [potash, calgary, seniorLeaders] = discussions;

// Home section order: portrait, landscape, portrait.
export const policyItems: PolicyItem[] = [seniorLeaders, potash, calgary];

export const policyDiscussionItems: PolicyItem[] = discussions;
