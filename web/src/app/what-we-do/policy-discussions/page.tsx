import type { Metadata } from "next";
import PolicyDiscussionsHero from "@/components/sections/policy-discussions/PolicyDiscussionsHero/PolicyDiscussionsHero";
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
    <main>
      <PolicyDiscussionsHero title={page.title} description={page.description} image={page.heroImage} />
      <PolicyDiscussionsListing items={page.discussions} />
    </main>
  );
}
