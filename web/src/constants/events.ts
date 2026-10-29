// Event content comes from the admin portal (Website Pages → Events), see src/lib/content.ts.
export type EventCategory = "upcoming" | "past";

export type EventGalleryImage = {
  src: string;
  alt: string;
};

export type EventItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href?: string;
  detailTitle?: string;
  // Text beside the first gallery image on the detail page.
  detailSummary?: string;
  gallery?: EventGalleryImage[];
};

export type EventGroups = Record<EventCategory, EventItem[]>;

export const emptyEventMessages: Record<EventCategory, string> = {
  upcoming: "There are no upcoming events at the moment. Please check back soon.",
  past: "There are no past events to show yet.",
};

// Open on past events while nothing is scheduled.
export function getDefaultEventCategory(events: EventGroups): EventCategory {
  return events.upcoming.length ? "upcoming" : "past";
}
