import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero/PageHero";
import NewsMediaListing from "@/components/sections/news-media/NewsMediaListing";
import { getNewsMediaPage } from "@/lib/content";
import JoinUs from "@/components/common/JoinUs/JoinUs";

// Read current admin content on every request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getNewsMediaPage();
  return { title: page.title || undefined, description: page.description || undefined };
}

export default async function NewsMediaPage() {
  const page = await getNewsMediaPage();
  return (
    <main>
      {page.title && page.heroImage && (
        <PageHero
          id="news-media-heading"
          title={page.title}
          description={page.description}
          image={{ desktop: page.heroImage, alt: page.title }}
          border={false}
        />
      )}
      <NewsMediaListing items={page.items} />
       <JoinUs />
    </main>
  );
}
