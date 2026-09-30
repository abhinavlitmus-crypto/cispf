import type { Metadata } from "next";
import PolicyDiscussionsHero from "@/components/sections/policy-discussions/PolicyDiscussionsHero/PolicyDiscussionsHero";
import PolicyDiscussionsListing from "@/components/sections/policy-discussions/PolicyDiscussionsListing/PolicyDiscussionsListing";

export const metadata: Metadata = {
  title: "Policy Discussions | Canada-India Strategic Partnership Forum",
  description: "Policy discussions from the Canada-India Strategic Partnership Forum.",
};

export default function PolicyDiscussionsPage() {
  return (
    <main>
      <PolicyDiscussionsHero />
      <PolicyDiscussionsListing />
    </main>
  );
}
