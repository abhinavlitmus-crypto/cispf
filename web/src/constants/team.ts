import members from "./team.json";

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  biography: string;
  linkedinUrl?: string;
};

export const teamMembers: TeamMember[] = members;
