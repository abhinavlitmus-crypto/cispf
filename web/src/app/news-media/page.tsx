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
        <div className="mx-auto max-w-[1920px] px-5 pt-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(3rem,5vw,6rem)] lg:pb-[clamp(3rem,4.5vw,5.5rem)]">
          <h1 id="news-media-heading" className="gradient-text mx-auto max-w-[19rem] text-center md:mx-0 md:w-fit md:max-w-none md:text-left text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[1.1] font-medium uppercase">{page.title || "News & Media"}</h1>
        </div>
        <NewsMediaListing items={page.items} />
      </main>
      <JoinUs />
    </>
  );
}
