import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsArrowUpRight } from "react-icons/bs";
import { cn } from "@/lib/utils";
import type { EventCardProps } from "@/utilities/ComponentTypes";

// "dark" is the events page; "light" is the white home page section (wider image, gradient date label).
const toneClasses = {
  dark: {
    layout: "text-white focus-visible:outline-white lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]",
    imageSizes: "(min-width: 1920px) 370px, (min-width: 1024px) 20vw, 40vw",
    border: "border-white/10",
    date: "relative flex flex-wrap gap-x-2 gap-y-1 py-1 pl-3 text-sm leading-relaxed before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[image:var(--gradient-brand-vertical)] before:content-[''] lg:text-[clamp(0.625rem,0.7vw,0.8125rem)]",
    dateValue: "text-white/75",
    summary: "text-white/85",
  },
  light: {
    layout: "text-black lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]",
    imageSizes: "(min-width: 1920px) 560px, (min-width: 1024px) 28vw, 50vw",
    border: "border-neutral-200",
    date: "flex flex-col gap-1 py-1 text-sm leading-relaxed lg:text-[clamp(0.8125rem,0.85vw,1rem)]",
    dateValue: "text-neutral-600",
    summary: "text-black line-clamp-5",
  },
};

export default function EventCard({ item, tone = "dark" }: EventCardProps) {
  const t = toneClasses[tone];
  const card = (
    <>
      <div className="relative aspect-[1.08] overflow-hidden self-start">
        <Image src={item.image} alt={item.imageAlt} fill sizes={t.imageSizes} className={`object-cover transition-transform duration-500 ease-out motion-reduce:transition-none ${item.href ? "lg:group-hover:scale-110 lg:group-focus-visible:scale-110 motion-reduce:lg:group-hover:scale-100 motion-reduce:lg:group-focus-visible:scale-100" : ""}`} />
        {item.href && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 motion-reduce:transition-none" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center text-white opacity-0 transition-[translate,opacity] duration-500 ease-out lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100 motion-reduce:transition-none">
              <BsArrowUpRight className="size-8" />
            </span>
          </>
        )}
      </div>
      {item.href && <span className="flex items-center justify-center gap-4 text-sm font-semibold text-primary lg:hidden">READ MORE<BsArrowRight aria-hidden="true" className="size-6 shrink-0" /></span>}
      <div className={cn("col-span-2 flex min-w-0 flex-col justify-between gap-6 border-t pt-2 lg:col-span-1 lg:gap-10", t.border, tone === "dark" ? "lg:pt-[clamp(2rem,4.2vw,5rem)]" : "lg:pt-[clamp(1rem,1.6vw,2rem)]")}>
        <p className={`${t.date} ${item.href ? "transition-transform delay-150 duration-500 ease-out lg:group-hover:-translate-y-6 lg:group-focus-visible:-translate-y-6 motion-reduce:lg:group-hover:translate-y-0 motion-reduce:lg:group-focus-visible:translate-y-0 motion-reduce:transition-none motion-reduce:delay-0" : ""}`}>
          {tone === "dark" ? <span>Event Date :</span> : <span className="gradient-text w-fit font-medium">Event Date</span>}
          <time dateTime={item.date} className={t.dateValue}>{item.dateLabel}</time>
        </p>
        <div className={`border-b ${t.border} pb-6 ${item.href ? "transition-transform delay-150 duration-500 ease-out motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:lg:group-hover:translate-y-0 motion-reduce:lg:group-focus-visible:translate-y-0 lg:group-hover:-translate-y-12 lg:group-focus-visible:-translate-y-12" : ""}`}>
          <h3 id={`${item.id}-title`} className="text-[clamp(1rem,1.2vw,1.375rem)] leading-tight font-medium">{item.title}</h3>
          <p className={`mt-3 text-base leading-snug font-light lg:text-[clamp(0.8125rem,0.95vw,1.0625rem)] ${t.summary}`}>{item.summary}</p>
        </div>
      </div>
    </>
  );

  return (
    <article className="min-w-0">
      {item.href ? (
        <Link href={item.href} aria-labelledby={`${item.id}-title`} className={cn("group grid grid-cols-2 gap-4 lg:gap-6", t.layout)}>
          {card}
        </Link>
      ) : (
        <div aria-labelledby={`${item.id}-title`} className={cn("grid grid-cols-2 gap-4 lg:gap-6", t.layout)}>
          {card}
        </div>
      )}
    </article>
  );
}
