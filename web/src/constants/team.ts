// Team content comes from the admin portal (Website Pages → Team), see src/lib/content.ts.
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  biography: string;
  linkedinUrl?: string;
};

// Groups in website order. Must match the admin and API lists.
export const teamGroups = ["BOARD MEMBER", "DIRECTOR", "ADVISOR"] as const;
export type TeamGroup = (typeof teamGroups)[number];

export type TeamPage = {
  title: string;
  // Only groups that have members, in teamGroups order.
  groups: { group: TeamGroup; members: TeamMember[] }[];
};
