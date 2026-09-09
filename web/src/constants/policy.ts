export type PolicyItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href: string;
};

// Design placeholders. Replace the contact links when discussion detail pages exist.
const title = "Senior leaders examined renewed policy coordination, institutional trust, trade, investment, talent mobility and community ties.";
const details = { title, date: "2026-05-11", dateLabel: "May 11, 2026", href: "/#contact" };

export const policyItems: PolicyItem[] = [
  { ...details, id: "policy-1", image: "/Image/placeholder-image-1.png", imageAlt: "Speaker addressing an audience" },
  { ...details, id: "policy-3", image: "/Image/placeholder-image-2.png", imageAlt: "Business representatives meeting" },
  { ...details, id: "policy-4", image: "/Image/placeholder-image-3.png", imageAlt: "Business representatives in discussion" },
  { ...details, id: "policy-2", image: "/Image/placeholder-image-5.png", imageAlt: "Policy discussion" },
];
