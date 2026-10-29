// Paths are relative to NEXT_PUBLIC_API_BASE_URL (no leading slash)

// Website pages: `type` is the page type in kebab-case, e.g. "event", "policy-discussion", "team"
export const WEBSITE_PAGE_LIST = (type: string) => `website-page/${type}/list`;
export const WEBSITE_PAGE_DETAILS = (type: string, slug: string) => `website-page/${type}/details/${slug}`;
