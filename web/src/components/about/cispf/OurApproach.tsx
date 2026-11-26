"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "CONNECT",
    image: "/about/our-approach-connect.webp",
    alt: "Three colleagues reviewing work together on a laptop",
    tagline: "Put the right people in the room.",
    description: "We connect business leaders, investors, policymakers and institutions across both markets.",
  },
  {
    title: "CONVENE",
    image: "/about/our-approach-convene.webp",
    alt: "Senior stakeholders in discussion around a meeting table",
    tagline: "Create space for decisions, not just discussion.",
    description: "We bring senior stakeholders together around the issues that can move the relationship forward.",
  },
  {
    title: "INFORM",
    image: "/about/our-approach-inform.webp",
    alt: "Presenter walking a team through data on a screen",
    tagline: "Make a complex landscape easier to navigate.",
    description: "We surface market intelligence, policy developments and sector insights that inform better decisions.",
  },
  {
    title: "ENABLE",
    image: "/about/our-approach-enable.webp",
    alt: "Container ship being loaded at a port",
    tagline: "Help opportunities move from conversation to action.",
    description: "We identify pathways, partnerships and practical solutions that can unlock cross-border growth.",
  },
];

// Hover artwork alternates between cards: maple leaf (Canada) on 1 and 3, chakra circle (India) on 2 and 4.
const hoverArt = [
  { src: "/about/our-approach-leaf.png", width: 396, height: 414, className: "w-[56%]" },
  { src: "/about/our-approach-circle.png", width: 187, height: 186, className: "w-[52%]" },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

// A card's image turns red with the leaf or circle on hover (desktop), tap (mobile) or keyboard focus.
export default function OurApproach() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = (index: number) => setActiveIndex((current) => (current === index ? null : current));

  return (
    <section aria-labelledby="our-approach-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-14 md:px-[clamp(1rem,8.6vw,10.5rem)] md:pt-[clamp(4rem,5vw,6rem)]">
        <h2 id="our-approach-heading" className="text-center text-[clamp(2.25rem,3.1vw,4rem)] leading-none font-medium text-primary">OUR APPROACH</h2>

        <ul className="mt-12 grid grid-cols-1 gap-x-[clamp(1.5rem,2.7vw,3.25rem)] gap-y-14 sm:grid-cols-2 md:mt-[clamp(3rem,4.8vw,5.75rem)] lg:grid-cols-4">
          {data.map((item, index) => {
            const isActive = activeIndex === index;
            const art = hoverArt[index % 2];
            return (
              <li
                key={item.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => close(index)}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => close(index)}
                className="flex flex-col border-b border-neutral-200 pb-[clamp(1.5rem,1.6vw,2rem)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <h3 className="text-base leading-tight font-semibold lg:text-[clamp(1rem,0.95vw,1.25rem)]">{formatIndex(index)} {item.title}</h3>

                <div className="relative isolate mt-4 aspect-square overflow-hidden bg-neutral-200 lg:mt-[clamp(1rem,1.1vw,1.5rem)]">
                  <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 19vw, (min-width: 640px) 45vw, 100vw" className={cn("-z-10 object-cover transition-transform duration-300 ease-out", isActive && "motion-safe:scale-110")} />
                  <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 grid place-items-center bg-[image:var(--gradient-card-overlay)] transition-opacity duration-500 ease-out motion-reduce:transition-none", isActive ? "opacity-100" : "opacity-0")}>
                    <Image src={art.src} alt="" width={art.width} height={art.height} sizes="10vw" className={cn("h-auto", art.className)} />
                  </div>
                </div>

                <p className="mt-8 text-[clamp(1.25rem,1.15vw,1.5rem)] leading-snug font-medium text-primary lg:mt-[clamp(1.5rem,1.6vw,2.25rem)]">{item.tagline}</p>
                <p className="mt-3 text-base leading-[1.5] lg:mt-[clamp(0.75rem,0.8vw,1rem)] lg:text-[clamp(1rem,0.95vw,1.25rem)]">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
