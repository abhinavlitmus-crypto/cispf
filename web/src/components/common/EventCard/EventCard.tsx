import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import type { EventItem } from "@/constants/events";

export default function EventCard({ item }: { item: EventItem }) {
  return (
    <article className="min-w-0">
      <Link href={item.href} aria-labelledby={`${item.id}-title`} className="group grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-4 text-white focus-visible:outline-white md:gap-6">
        <div className="relative aspect-[1.08] overflow-hidden self-start">
          <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1920px) 370px, (min-width: 1024px) 20vw, 40vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center opacity-0 transition-[translate,opacity] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <BsArrowUpRight className="size-8" />
          </span>
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-10 border-t border-white/10 pt-6 md:pt-[clamp(2rem,4.2vw,5rem)]">
          <p className="relative flex flex-wrap gap-x-2 gap-y-1 py-1 pl-3 text-[clamp(0.625rem,0.7vw,0.8125rem)] leading-relaxed transition-transform delay-150 duration-500 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[image:var(--gradient-brand-vertical)] before:content-[''] group-hover:-translate-y-4 group-focus-visible:-translate-y-4 md:group-hover:-translate-y-6 md:group-focus-visible:-translate-y-6 md:motion-reduce:group-hover:translate-y-0 md:motion-reduce:group-focus-visible:translate-y-0 motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0">
            <span>Event Date :</span><time dateTime={item.date} className="text-white/75">{item.dateLabel}</time>
          </p>
          <div className="border-b border-white/10 pb-4 transition-transform delay-150 duration-500 ease-out group-hover:-translate-y-6 group-focus-visible:-translate-y-6 motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 md:pb-6 md:group-hover:-translate-y-12 md:group-focus-visible:-translate-y-12 md:motion-reduce:group-hover:translate-y-0 md:motion-reduce:group-focus-visible:translate-y-0">
            <h3 id={`${item.id}-title`} className="text-[clamp(1rem,1.2vw,1.375rem)] leading-tight font-medium">{item.title}</h3>
            <p className="mt-3 text-[clamp(0.8125rem,0.95vw,1.0625rem)] leading-snug font-light text-white/85">{item.summary}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
