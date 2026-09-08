// Placeholder content from the design. Replace destinations when article pages exist.
export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  publishedLabel: string;
  href: string;
};

const summary = "Senior leaders examined renewed policy coordination, institutional trust, trade, investment, talent mobility and community ties.";

export const newsItems: NewsItem[] = [
  { id: "news-1", title: "News & media heading", summary, image: "/Image/placeholder-image-1.png", imageAlt: "Speaker addressing an audience", publishedAt: "2026-05-11", publishedLabel: "May 11, 2026", href: "/#contact" },
  { id: "news-2", title: "News & media heading News & media heading", summary, image: "/Image/placeholder-image-2.png", imageAlt: "Business representatives meeting and shaking hands", publishedAt: "2026-05-11", publishedLabel: "May 11, 2026", href: "/#contact" },
  { id: "news-3", title: "News & media heading", summary: `${summary} ${summary}`, image: "/Image/placeholder-image-1.png", imageAlt: "Speaker addressing an audience", publishedAt: "2026-05-11", publishedLabel: "May 11, 2026", href: "/#contact" },
  { id: "news-4", title: "News & media heading", summary, image: "/Image/placeholder-image-2.png", imageAlt: "Business representatives meeting and shaking hands", publishedAt: "2026-05-11", publishedLabel: "May 11, 2026", href: "/#contact" },
];
