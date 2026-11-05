import type { Metadata } from "next";
import PolicyDiscussionsListing from "@/components/sections/policy-discussions/PolicyDiscussionsListing/PolicyDiscussionsListing";
import { getPolicyDiscussionsPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Policy Discussions | Canada-India Strategic Partnership Forum",
  description: "Policy discussions from the Canada-India Strategic Partnership Forum.",
};

// Re-read admin portal content at most every 5 minutes.
export const revalidate = 300;


export default async function PolicyDiscussionsPage() {
  const page = await getPolicyDiscussionsPage();

  return (
    <main className="relative z-10 bg-white">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(3rem,5vw,6rem)] lg:pb-[clamp(3rem,4.5vw,5.5rem)]">
        <h1 className="gradient-text mx-auto max-w-[19rem] text-center md:mx-0 md:w-fit md:max-w-none md:text-left text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[1.1] font-medium uppercase">{page.title || "Policy Discussions"}</h1>
      </div>
      <PolicyDiscussionsListing items={page.discussions} />
    </main>
  );
}
