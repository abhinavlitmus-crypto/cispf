// Team content comes from the admin portal (Website Pages → Team), see src/lib/content.ts.
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  biography: string;
  linkedinUrl?: string;
};

export type TeamPage = {
  title: string;
  members: TeamMember[];
};
