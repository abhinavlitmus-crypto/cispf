import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import NewsCard, { NewsComingSoonCard } from "@/components/common/NewsCard/NewsCard";
import { getNewsletters } from "@/lib/content";

const columns = 4;

export default async function NewsMedia() {
  const newsItems = (await getNewsletters()).slice(0, columns);
  if (!newsItems.length) return null;

  return (
    <section id="news-media" aria-labelledby="news-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="news-heading" className="text-primary w-fit text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium">NEWS & MEDIA</h2>
          <Button href="/news-media" className="group max-w-full shrink-0 px-4 text-xs sm:px-6 sm:text-sm">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none">VIEW ALL NEWS & MEDIA</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none">
                <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </Button>
        </div>
        {/* Always four columns on desktop; "Coming Soon" cards fill the slots without a publication. */}
        <div className="mt-10 grid items-start gap-x-[clamp(1.5rem,2.6vw,3rem)] gap-y-10 sm:grid-cols-2 md:mt-[clamp(3rem,4.5vw,5.5rem)] lg:grid-cols-4">
          {newsItems.map((item) => <NewsCard key={item.id} item={item} />)}
          {Array.from({ length: columns - newsItems.length }, (_, index) => (
            <div key={index} className="hidden lg:block"><NewsComingSoonCard /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
