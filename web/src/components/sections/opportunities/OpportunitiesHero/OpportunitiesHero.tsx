import PageHero from "@/components/common/PageHero/PageHero";

export default function OpportunitiesHero() {
  return (
    <PageHero
      id="opportunities-heading"
      title="OPPORTUNITIES"
      description="The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity."
      image={{ desktop: "/Image/opportunities-image-desktop.webp", mobile: "/Image/opportunities-image-mobile.webp", alt: "Audience attending a forum presentation" }}
      gradient
    />
  );
}
