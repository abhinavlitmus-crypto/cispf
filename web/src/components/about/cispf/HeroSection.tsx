import PageHero from "@/components/common/PageHero/PageHero";

export default function HeroSection() {
  return (
    <PageHero
      id="about-cispf-heading"
      title="ABOUT CISPF"
      border={false}
      description="The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity."
      // TODO: Replace with the Toronto skyline images from the design.
      image={{ desktop: "/about/hero.jpg", mobile: "/Image/opportunities-image-mobile.webp", alt: "Canadian flag flying in front of the Toronto skyline" }}
    />
  );
}
