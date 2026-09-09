export type EventCategory = "upcoming" | "past";
export type EventItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href: string;
};

const images = [
  { image: "/Image/placeholder-image-3.png", imageAlt: "Business representatives in discussion" },
  { image: "/Image/placeholder-image-1.png", imageAlt: "Speaker addressing an audience" },
  { image: "/Image/placeholder-image-2.png", imageAlt: "Business representatives greeting each other" },
];

// Design fixtures for four pages per tab. Replace with CMS events and detail URLs.
function createEvents(category: EventCategory): EventItem[] {
  return Array.from({ length: 16 }, (_, index) => ({
    id: `${category}-${index + 1}`,
    title: "News & media heading",
    summary: "Senior leaders examined renewed policy coordination, institutional trust, trade, investment, talent mobility and community ties.",
    ...images[(index + (category === "past" ? 1 : 0)) % images.length],
    date: category === "upcoming" ? "2026-11-11" : "2026-05-11",
    dateLabel: category === "upcoming" ? "Nov 11, 2026" : "May 11, 2026",
    href: "/#contact",
  }));
}

export const eventItems: Record<EventCategory, EventItem[]> = {
  upcoming: createEvents("upcoming"),
  past: createEvents("past"),
};
