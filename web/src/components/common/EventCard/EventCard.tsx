import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsArrowUpRight } from "react-icons/bs";
import type { EventItem } from "@/constants/events";

export default function EventCard({ item }: { item: EventItem }) {
  return (
    <article className="min-w-0">
      <Link href={item.href} aria-labelledby={`${item.id}-title`} className="group grid grid-cols-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-4 text-white focus-visible:outline-white lg:gap-6">
        <div className="relative aspect-[1.08] overflow-hidden self-start">
          <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1920px) 370px, (min-width: 1024px) 20vw, 40vw" className="object-cover transition-transform duration-500 ease-out lg:group-hover:scale-110 lg:group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:lg:group-hover:scale-100 motion-reduce:lg:group-focus-visible:scale-100" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 motion-reduce:transition-none" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center opacity-0 transition-[translate,opacity] duration-500 ease-out lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100 motion-reduce:transition-none">
            <BsArrowUpRight className="size-8" />
          </span>
        </div>
        <span className="flex items-center justify-center gap-4 text-sm font-semibold text-primary lg:hidden">READ MORE<BsArrowRight aria-hidden="true" className="size-6 shrink-0" /></span>
        <div className="col-span-2 lg:col-span-1 flex min-w-0 flex-col justify-between gap-6 lg:gap-10 lg:border-t border-white/10 pt-2 lg:pt-[clamp(2rem,4.2vw,5rem)]">
          <p className="relative flex flex-wrap gap-x-2 gap-y-1 py-1 pl-3 text-sm lg:text-[clamp(0.625rem,0.7vw,0.8125rem)] leading-relaxed transition-transform delay-150 duration-500 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[image:var(--gradient-brand-vertical)] before:content-[''] lg:group-hover:-translate-y-6 lg:group-focus-visible:-translate-y-6 motion-reduce:lg:group-hover:translate-y-0 motion-reduce:lg:group-focus-visible:translate-y-0 motion-reduce:transition-none motion-reduce:delay-0">
            <span>Event Date :</span><time dateTime={item.date} className="text-white/75">{item.dateLabel}</time>
          </p>
          <div className="border-b border-white/10 pb-6 transition-transform delay-150 duration-500 ease-out motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:lg:group-hover:translate-y-0 motion-reduce:lg:group-focus-visible:translate-y-0 lg:pb-6 lg:group-hover:-translate-y-12 lg:group-focus-visible:-translate-y-12">
            <h3 id={`${item.id}-title`} className="text-[clamp(1rem,1.2vw,1.375rem)] leading-tight font-medium">{item.title}</h3>
            <p className="mt-3 text-base lg:text-[clamp(0.8125rem,0.95vw,1.0625rem)] leading-snug font-light text-white/85">{item.summary}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
