// TODO: Connect these destinations when the corresponding sections are built.
export const navigation = [
  { label: "ABOUT US", href: "#", children: [
    { label: "ABOUT CISPF", href: "/about/cispf" },
    { label: "OUR EXPERT TEAM", href: "/about/team" },
    // TODO: Implement the careers page.
    { label: "CAREERS", href: "/careers" },
  ] },
  { label: "WHAT WE DO", href: "/#what-we-do", children: [
    { label: "POLICY DISCUSSIONS", href: "/what-we-do/policy-discussions" },
    { label: "OPPORTUNITIES", href: "/what-we-do/opportunities" },
  ] },
  // TODO: Implement the news & media page.
  { label: "NEWS & MEDIA", href: "/news-media" },
  // { label: "RESEARCH WORK", href: "/#research" },
  { label: "EVENTS", href: "/events" },
];

export const connectLink = { label: "LET’S CONNECT", href: "/contact-us" };

// Routes whose hero sits behind a transparent desktop header.
export const transparentHeaderRoutes = ["/events"];
