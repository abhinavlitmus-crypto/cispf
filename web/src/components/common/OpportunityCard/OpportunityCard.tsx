import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import type { OpportunityItem } from "@/constants/opportunities";

export default function OpportunityCard({ item }: { item: OpportunityItem }) {
  return (
    <article className="min-w-0">
      <Link href={item.href} aria-labelledby={`${item.id}-heading`} className="group relative isolate block aspect-[4/7] overflow-hidden bg-neutral-900 text-white">
        <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />

        <div className="relative p-6 md:p-8">
          <p aria-hidden="true" className="relative flex items-center gap-3 py-1 pl-3 text-[clamp(0.6875rem,0.75vw,0.875rem)] font-semibold tracking-wide uppercase opacity-100 transition-opacity duration-500 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[image:var(--gradient-brand-vertical)] before:content-[''] group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
            {item.eyebrow}
          </p>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center p-6 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none md:p-8">
            <BsArrowUpRight className="size-8" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <h3 id={`${item.id}-heading`} className="text-[clamp(1.375rem,2vw,2rem)] leading-tight font-medium">{item.heading}</h3>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] motion-reduce:grid-rows-[1fr] motion-reduce:transition-none">
            <div className="overflow-hidden">
              <p className="pt-4 text-[clamp(0.9375rem,1vw,1.125rem)] leading-snug font-light opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
