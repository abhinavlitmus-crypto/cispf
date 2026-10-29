import PageHero from "@/components/common/PageHero/PageHero";

const fallback = {
  title: "POLICY DISCUSSIONS",
  description: "The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity.",
};

// Text and desktop image come from the admin portal; the local images are used until one is uploaded.
export default function PolicyDiscussionsHero({ title, description, image }: { title?: string; description?: string; image?: string }) {
  return (
    <PageHero
      id="policy-discussions-heading"
      title={title || fallback.title}
      description={description || fallback.description}
      image={image
        ? { desktop: image, mobile: "/Policy Discussion/hero-mobile.png", alt: "Delegates seated around a round table in a council chamber" }
        : { desktop: "/Policy Discussion/hero-desktop.png", mobile: "/Policy Discussion/hero-mobile.png", alt: "Delegates seated around a round table in a council chamber" }}
      gradient
      border={false}
    />
  );
}
