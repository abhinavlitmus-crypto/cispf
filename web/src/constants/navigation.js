// TODO: Connect these destinations when the corresponding sections are built.
export const navigation = [
  { label: "ABOUT US", href: "/about/cispf", children: [
    { label: "ABOUT CISPF", href: "/about/cispf" },
    { label: "OUR TEAM", href: "/about/team" },
    // TODO: Implement the careers page.
    // { label: "CAREERS", href: "/careers" },
  ] },
  // Events sits under What We Do; Opportunities is its own top-level item. Old URLs redirect (next.config.ts).
  { label: "WHAT WE DO", href: "/what-we-do/policy-discussions", children: [
    { label: "POLICY DISCUSSIONS", href: "/what-we-do/policy-discussions" },
    { label: "EVENTS", href: "/what-we-do/events" },
  ] },
  // TODO: Implement the news & media page.
  { label: "NEWS & MEDIA", href: "/news-media" },
  // { label: "RESEARCH WORK", href: "/#research" },
  { label: "RESEARCH", href: "/opportunities" },
];

export const connectLink = { label: "LET’S CONNECT", href: "/contact-us" };

// Routes whose full-screen hero sits behind a transparent desktop header. /events no longer has a hero image.
export const transparentHeaderRoutes = ["/", "/about/cispf"];
