import type { Metadata } from "next";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import NewsMediaListing from "@/components/sections/news-media/NewsMediaListing";
import { getNewsMediaPage } from "@/lib/content";

// Read current admin content on every request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getNewsMediaPage();
  return {
    title: "News & Media | Canada-India Strategic Partnership Forum",
    description: page.description || "News and media from the Canada-India Strategic Partnership Forum.",
  };
}

// Same layout as the team page: the title, then the publications.
export default async function NewsMediaPage() {
  const page = await getNewsMediaPage();

  return (
    <>
      <main className="relative z-10 bg-white">
        <div className="mx-auto max-w-[1920px] px-5 pt-12 md:px-[clamp(1rem,8.6vw,10.5rem)] md:pt-[clamp(3rem,5vw,6rem)]">
          <h1 id="news-media-heading" className="mx-auto max-w-[19rem] text-center text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium text-primary uppercase md:mx-0 md:w-fit md:max-w-none md:text-left">{page.title || "News & Media"}</h1>
        </div>
        <NewsMediaListing items={page.items} />
        {/* Figma: only the skyline above the footer on this page. */}
        <JoinUs skylineOnly />
      </main>
    </>
  );
}
