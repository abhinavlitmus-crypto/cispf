import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import NewsCard from "@/components/common/NewsCard/NewsCard";
import { newsItems } from "@/constants/news";

export default function NewsMedia() {
  return (
    <section id="news-media" aria-labelledby="news-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)]">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 id="news-heading" className="text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium">NEWS & MEDIA</h2>
          {/* TODO: Replace with the news listing URL when the listing page exists. */}
          <Button href="/#contact" className="group relative isolate max-w-full hover:brightness-100 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-primary before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100 focus-visible:before:opacity-100 motion-reduce:before:transition-none">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none">VIEW ALL NEWS & MEDIA</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none">
                <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </Button>
        </div>
        <div className="mt-10 grid items-start gap-x-[clamp(1.5rem,2.6vw,3rem)] gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {newsItems.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
