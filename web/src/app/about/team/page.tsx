import type { Metadata } from "next";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import TeamCard from "@/components/common/TeamCard/TeamCard";
import { getTeamPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team | Canada-India Strategic Partnership Forum",
  description: "Meet the team behind the Canada–India Strategic Partnership Forum.",
};

// Re-read admin portal content at most every 5 minutes.
export const revalidate = 300;

export default async function TeamPage() {
  const { title, members } = await getTeamPage();

  return (
    <>
      <main className="relative z-10 bg-white">
        <section aria-labelledby="team-heading" className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(3rem,5vw,6rem)] md:pb-24">
          <h1 id="team-heading" className="gradient-text mx-auto max-w-[19rem] text-center md:mx-0 md:w-fit md:max-w-none md:text-left text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[1.1] font-medium uppercase">{title}</h1>
          <div className="mt-12 grid grid-cols-1 gap-x-[clamp(1.25rem,1.6vw,2rem)] gap-y-8 sm:grid-cols-2 md:mt-[clamp(4rem,6vw,7.5rem)] md:gap-y-[clamp(3rem,4.8vw,6rem)] lg:grid-cols-4">
            {members.map((member) => <TeamCard key={member.id} member={member} />)}
          </div>
        </section>
      </main>
      <JoinUs />
    </>
  );
}
