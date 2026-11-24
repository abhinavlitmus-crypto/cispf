// Server-side: reads the admin portal's website pages and shapes them for the existing components.
// Pages using these export `revalidate`, so edits in the admin portal show up within that window.
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { getWebsitePageList, type WebsitePage } from "@/api/websitePage";
import type { EventGroups, EventItem } from "@/constants/events";
import type { PolicyDiscussionsPage, PolicyItem } from "@/constants/policy";
import { teamGroups, type TeamMember, type TeamPage } from "@/constants/team";
import type { NewsItem } from "@/constants/news";

type EventDetails = {
  publishDate?: string | null;
  mainImage?: string;
  title?: string;
  description?: string;
  slug?: string;
  insideTitle?: string;
  sections?: { image?: string; date?: string | null; description?: string }[];
  featureImages?: string[];
};

type PolicyDiscussionDetails = {
  title?: string;
  description?: string;
  mainImage?: string;
  sections?: {
    images?: string[];
    date?: string | null;
    title?: string;
    authorName?: string;
    authorDesignation?: string;
    mainImage?: string;
    mainDescription?: string;
  }[];
};

type TeamDetails = {
  title?: string;
  sections?: { images?: string[]; name?: string; group?: string; designation?: string; description?: string; socialLinks?: { linkedin?: string } }[];
};

// One request per type per render. If the API is down the page renders without that content instead of failing.
const getPages = cache(async <D,>(type: string): Promise<WebsitePage<D>[]> => {
  try {
    const response = await getWebsitePageList<D>(type, { isAll: true });
    return response.data.data ?? [];
  } catch (error) {
    console.error(`Could not load "${type}" website pages`, error instanceof Error ? error.message : error);
    return [];
  }
});

// Cloudinary returns http links; the site only loads images over https.
const secureUrl = (url?: string) => (url ?? "").replace(/^http:\/\//i, "https://");

// The admin stores a picked day as local midnight in UTC (4 June in India is 2026-06-03T18:30Z).
// Rounding to the nearest UTC day gives back the picked day for any timezone within ±12 hours.
function toCalendarDate(value?: string | null) {
  const time = value ? Date.parse(value) : NaN;
  return Number.isNaN(time) ? "" : new Date(time + 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const dateLabelFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (calendarDate: string) => (calendarDate ? dateLabelFormat.format(new Date(calendarDate)) : "");

export const getNewsMediaPage = cache(async () => {
  const [page] = await getPages<{
    title?: string; description?: string; mainImage?: string;
    sections?: { image?: string; publishedDate?: string | null; title?: string; description?: string; externalLink?: string }[];
  }>("newsletter");

  const details = page?.details ?? {};
  const items = (details.sections ?? []).flatMap((section, index): NewsItem[] => {
      if (!section.title || !section.image || !section.externalLink) return [];
      try {
        const url = new URL(section.externalLink);
        if (!["http:", "https:"].includes(url.protocol)) return [];
      } catch { return []; }
      const date = toCalendarDate(section.publishedDate);
      return [{
        id: `${page!._id}-${index}`,
        title: section.title,
        summary: section.description ?? "",
        image: secureUrl(section.image),
        imageAlt: section.title,
        publishedAt: date,
        publishedLabel: formatDate(date),
        href: section.externalLink.trim(),
      }];
    }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return {
    title: details.title ?? "",
    description: details.description ?? "",
    heroImage: secureUrl(details.mainImage),
    items,
  };
});

export const getNewsletters = cache(async (): Promise<NewsItem[]> => (await getNewsMediaPage()).items);

// Events dated today or later in Toronto count as upcoming.
const todayInToronto = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Article HTML from the admin editor: keeps structure, links and existing classes, drops anything executable.
function sanitizeArticle(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["section", "div", "span", "h2", "h3", "h4", "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "sup", "sub", "blockquote"],
    allowedAttributes: {
      "*": ["class", "id", "aria-label", "aria-labelledby"],
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

function toEvent({ details }: WebsitePage<EventDetails>): EventItem | null {
  if (!details.slug || !details.title) return null;
  const date = toCalendarDate(details.publishDate);
  const section = details.sections?.[0];
  const galleryImages = details.featureImages?.length ? details.featureImages : [section?.image].filter(Boolean) as string[];

  return {
    id: details.slug,
    title: details.title,
    summary: details.description ?? "",
    image: secureUrl(details.mainImage),
    imageAlt: details.title,
    date,
    dateLabel: formatDate(date),
    href: `/what-we-do/events/${details.slug}`,
    detailTitle: details.insideTitle || details.title,
    detailSummary: section?.description || details.description || "",
    gallery: galleryImages.map((src, index) => ({ src: secureUrl(src), alt: `${details.title}, photo ${index + 1}` })),
  };
}

export const getEvents = cache(async (): Promise<EventGroups> => {
  const events = (await getPages<EventDetails>("event")).map(toEvent).filter((event): event is EventItem => !!event?.image);
  const today = todayInToronto();

  return {
    // Soonest first.
    upcoming: events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    // Most recent first.
    past: events.filter((event) => event.date < today).sort((a, b) => b.date.localeCompare(a.date)),
  };
});

export async function getEvent(slug: string) {
  const { upcoming, past } = await getEvents();
  return [...upcoming, ...past].find((event) => event.id === slug);
}

export const getPolicyDiscussionsPage = cache(async (): Promise<PolicyDiscussionsPage> => {
  const [page] = await getPages<PolicyDiscussionDetails>("policy-discussion");
  const details = page?.details ?? {};
  const usedSlugs = new Set<string>();

  const discussions = (details.sections ?? []).flatMap((section): PolicyItem[] => {
    const title = section.title?.trim();
    if (!title || !section.mainImage) return [];

    // Discussions have no slug field, so the URL comes from the title.
    const baseSlug = slugify(title) || "discussion";
    let slug = baseSlug;
    for (let n = 2; usedSlugs.has(slug); n++) slug = `${baseSlug}-${n}`;
    usedSlugs.add(slug);

    const colon = title.indexOf(":");
    const date = toCalendarDate(section.date);
    return [{
      id: slug,
      title,
      image: secureUrl(section.mainImage),
      imageAlt: title,
      date,
      dateLabel: formatDate(date),
      href: `/what-we-do/policy-discussions/${slug}`,
      detailTitle: colon > 0 ? title.slice(0, colon).trim() : title,
      subtitle: colon > 0 ? title.slice(colon + 1).trim() : undefined,
      author: section.authorName ? { name: section.authorName, role: section.authorDesignation ?? "" } : undefined,
      detailImage: section.images?.[0] ? secureUrl(section.images[0]) : undefined,
      detailImageAlt: "",
      content: sanitizeArticle(section.mainDescription ?? ""),
    }];
  });

  return {
    title: details.title || "Policy Discussions",
    description: details.description ?? "",
    heroImage: details.mainImage ? secureUrl(details.mainImage) : undefined,
    // Most recent first.
    discussions: discussions.sort((a, b) => b.date.localeCompare(a.date)),
  };
});

export async function getPolicyDiscussion(slug: string) {
  const { discussions } = await getPolicyDiscussionsPage();
  return discussions.find((discussion) => discussion.id === slug);
}

export const getTeamPage = cache(async (): Promise<TeamPage> => {
  const [page] = await getPages<TeamDetails>("team");
  const details = page?.details ?? {};
  const sections = details.sections ?? [];

  // Members without a valid group are not shown; the admin requires one before saving.
  const groups = teamGroups.map((group) => ({
    group,
    members: sections.flatMap((member, index): TeamMember[] => member.group === group && member.name && member.images?.[0] ? [{
      id: `team-${slugify(member.name) || index}`,
      name: member.name,
      // An empty designation falls back to the group, e.g. "DIRECTOR".
      title: member.designation?.trim() || group,
      image: secureUrl(member.images[0]),
      biography: member.description ?? "",
      linkedinUrl: member.socialLinks?.linkedin || undefined,
    }] : []),
  })).filter(({ members }) => members.length);

  return { title: details.title || "Our Team", groups };
});
