import PageHero from "@/components/common/PageHero/PageHero";

export default function HeroSection() {
  return (
    <PageHero
      id="about-cispf-heading"
      title="ABOUT CISPF"
      border={false}
      description={"The Canada–India Strategic Partnership Forum (CISPF) is an independent, non-partisan organization dedicated to strengthening commercial, strategic, and people-to-people ties between Canada and India. CISPF connects business leaders, policymakers, investors, researchers, and institutions to encourage informed dialogue and identify practical opportunities for bilateral cooperation.\n\nCISPF builds upon the experience and international network of the U.S.-India Strategic Partnership Forum (USISPF), which represents more than 450 global companies and works to strengthen economic, strategic, and people-to-people ties between the United States and India. USISPF’s record of convening government and industry leaders, supporting cross-border business growth, producing policy research, and facilitating sector-specific cooperation provides a strong foundation for engagement in Canada."}
      // TODO: Add the mobile Toronto skyline image from the design; the desktop one is shown until then.
      image={{ desktop: "/about/Background.png", alt: "Canadian flag flying in front of the Toronto skyline" }}
    />
  );
}
