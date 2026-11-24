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
      <div className="mx-auto max-w-[1920px] px-5 pt-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(3rem,5vw,6rem)] md:pb-0">
        <h1 className="mx-auto max-w-[19rem] text-center text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium text-primary uppercase md:mx-0 md:w-fit md:max-w-none md:text-left">{page.title || "Recent Policy Discussions"}</h1>
      </div>
      <PolicyDiscussionsListing items={page.discussions} />
    </main>
  );
}
