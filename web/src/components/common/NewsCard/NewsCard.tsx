import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import type { NewsItem } from "@/constants/news";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="min-w-0">
      <Link href={item.href} aria-labelledby={`${item.id}-title`} className="group block">
        <div className="relative aspect-square overflow-hidden">
          <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1920px) 440px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center text-white opacity-0 transition-[translate,opacity] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <BsArrowUpRight className="size-8" />
          </span>
        </div>
        <div className="border-b border-neutral-200 py-4 lg:py-8 transition-transform delay-75 duration-500 ease-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none motion-reduce:delay-0">
          <p className="relative flex flex-wrap items-center gap-x-3 gap-y-1 py-1 pl-3 text-[clamp(0.6875rem,0.75vw,0.875rem)] leading-relaxed before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[image:var(--gradient-brand-vertical)] before:content-['']">
            <span className="font-medium">Published Date :</span>
            <time dateTime={item.publishedAt}>{item.publishedLabel}</time>
          </p>
        </div>
        <div className="border-b border-neutral-200 py-5 transition-transform delay-150 duration-500 ease-out group-hover:-translate-y-3 group-focus-visible:-translate-y-3 motion-reduce:transition-none motion-reduce:delay-0">
          <h3 id={`${item.id}-title`} className="text-[clamp(1.0625rem,1.2vw,1.375rem)] leading-tight font-medium">{item.title}</h3>
          <p className="mt-3 text-[clamp(0.875rem,0.98vw,1.125rem)] leading-snug font-light">{item.summary}</p>
        </div>
      </Link>
    </article>
  );
}
