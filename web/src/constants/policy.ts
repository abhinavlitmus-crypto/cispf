// Policy discussion content comes from the admin portal (Website Pages → Policy Discussion), see src/lib/content.ts.
export type PolicyItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  href: string;
  // Detail page: the title is split at its first colon into a heading and a subtitle.
  detailTitle: string;
  subtitle?: string;
  author?: { name: string; role: string };
  detailImage?: string;
  detailImageAlt?: string;
  // Sanitized article HTML.
  content: string;
};

export type PolicyDiscussionsPage = {
  title: string;
  description: string;
  heroImage?: string;
  discussions: PolicyItem[];
};
