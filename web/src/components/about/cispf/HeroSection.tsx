import PageHero from "@/components/common/PageHero/PageHero";

export default function HeroSection() {
  return (
    <PageHero
      id="about-cispf-heading"
      title="ABOUT CISPF"
      border={false}
      description="The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity."
      // TODO: Add the mobile Toronto skyline image from the design; the desktop one is shown until then.
      image={{ desktop: "/about/Background.png", alt: "Canadian flag flying in front of the Toronto skyline" }}
    />
  );
}
