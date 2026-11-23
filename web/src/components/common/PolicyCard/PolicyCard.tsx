import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsArrowUpRight } from "react-icons/bs";
import type { PolicyCardProps } from "@/utilities/ComponentTypes";

const aspectClasses = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/9]",
  listing: "aspect-1056/778",
  square: "aspect-square",
};

const imageSizes = {
  portrait: "(min-width: 1920px) 430px, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw",
  landscape: "(min-width: 1920px) 780px, (min-width: 1024px) 43vw, 100vw",
  listing: "(min-width: 1920px) 560px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw",
  square: "(min-width: 1920px) 600px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw",
};

// Faded stand-in that fills empty columns while there are fewer than three discussions.
export function PolicyComingSoonCard() {
  return (
    <div aria-hidden="true" className="min-w-0 select-none">
      <div className="flex aspect-square items-center justify-center bg-neutral-100/70">
        <p className="text-[clamp(1rem,1.2vw,1.375rem)] text-neutral-400">Coming Soon !</p>
      </div>
      <p className="flex gap-x-3 py-5 text-[clamp(0.75rem,0.85vw,1rem)] leading-relaxed opacity-40 lg:py-7">
        <span className="gradient-text font-medium">Date of discussion</span>
        <span className="text-neutral-500">N.A</span>
      </p>
      <div className="relative pt-3 pl-5 opacity-30">
        <Image src="/Icon/quaote1.svg" alt="" width={81} height={93} className="pointer-events-none absolute -top-3 left-0 h-auto w-12 lg:w-16" />
        <p className="relative text-[clamp(1.0625rem,1.3vw,1.5rem)] leading-[1.3] text-neutral-400">More policy discussions will be listed soon. Subscribe to never miss an update.</p>
      </div>
    </div>
  );
}

export default function PolicyCard({ item, variant = "portrait" }: PolicyCardProps) {
  return (
    <article className="min-w-0">
      <Link href={item.href} aria-labelledby={`${item.id}-title`} className="group block">
        <div className={`relative overflow-hidden ${aspectClasses[variant]}`}>
          <Image src={item.image} alt={item.imageAlt} fill sizes={imageSizes[variant]} className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center text-white opacity-0 transition-[translate,opacity] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <BsArrowUpRight className="size-8" />
          </span>
        </div>
        <div className="py-4 transition-transform delay-75 duration-500 ease-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 lg:py-6">
          <p className="flex flex-wrap gap-x-3 gap-y-1 py-1 text-[clamp(0.75rem,0.85vw,1rem)] leading-relaxed">
            <span className="gradient-text font-medium">Date of discussion</span><time dateTime={item.date} className="text-neutral-600">{item.dateLabel}</time>
          </p>
        </div>
        <div className="relative pt-3 pl-3 transition-transform delay-150 duration-500 ease-out group-hover:-translate-y-3 group-focus-visible:-translate-y-3 motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0">
          <Image src="/Icon/quaote1.svg" alt="" aria-hidden="true" width={81} height={93} className="pointer-events-none absolute -top-3 left-0 h-auto w-12 lg:w-16" />
          <h3 id={`${item.id}-title`} className="relative text-[clamp(1.0625rem,1.3vw,1.5rem)] leading-[1.3] font-medium">{item.title}</h3>
        </div>
        <div className="border-b border-neutral-200 pb-8 md:hidden"><span className="mt-8 flex items-center gap-6 text-sm font-semibold text-primary md:hidden">READ MORE<BsArrowRight aria-hidden="true" className="size-6 shrink-0" /></span></div>
      </Link>
    </article>
  );
}
