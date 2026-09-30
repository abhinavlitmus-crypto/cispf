import PageHero from "@/components/common/PageHero/PageHero";

export default function PolicyDiscussionsHero() {
  return (
    <PageHero
      id="policy-discussions-heading"
      title="POLICY DISCUSSIONS"
      description="The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity."
      image={{ desktop: "/Policy Discussion/hero-desktop.png", mobile: "/Policy Discussion/hero-mobile.png", alt: "Delegates seated around a round table in a council chamber" }}
      gradient
      border={false}
    />
  );
}
