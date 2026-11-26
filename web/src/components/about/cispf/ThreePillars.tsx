"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "ECONOMIC & COMMERCIAL WORK",
    image: "/about/three-pillar-economic-work.webp",
    alt: "Crane lifting a shipping container at a port",
    description: "Advancing trade, investment and business-friendly policy to unlock the full potential of the Canada–India economic corridor.",
  },
  {
    title: "GEOPOLITICAL & SECURITY CONVERGENCE",
    image: "/about/three-pillar-geopolitical.webp",
    alt: "Coast guard crew walking across the ice in front of an icebreaker",
    description: "Aligning strategic interests on security, technology and supply-chain resilience across the Indo-Pacific and beyond.",
  },
  {
    title: "PEOPLE-TO-PEOPLE TIES",
    image: "/about/three-pillar-people-to-people.webp",
    alt: "Two professionals shaking hands",
    description: "Strengthening the education, cultural and diaspora links that form the foundation of the Canada–India relationship.",
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

// All pillars start closed. Hovering (desktop), tapping (mobile) or keyboard focus opens one:
// red overlay, white number and its description. Closed descriptions stay in the DOM for screen readers.
export default function ThreePillars() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = (index: number) => setActiveIndex((current) => (current === index ? null : current));

  return (
    <section aria-labelledby="three-pillars-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-14 pb-16 md:px-[clamp(1rem,8.6vw,10.5rem)] md:pt-[clamp(4rem,5vw,6rem)] md:pb-[clamp(4rem,5.5vw,6.5rem)]">
        <h2 id="three-pillars-heading" className="text-center text-[clamp(2.25rem,3.4vw,4.25rem)] leading-tight font-medium text-primary">
          OUR THREE PILLARS
        </h2>

        <ul className="mt-10 grid gap-5 md:mt-[clamp(2.5rem,4.2vw,5rem)] md:grid-cols-3 md:gap-[clamp(0.75rem,1vw,1.25rem)]">
          {data.map((pillar, index) => {
            const isActive = activeIndex === index;
            return (
              <li
                key={pillar.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => close(index)}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => close(index)}
                className="relative isolate aspect-1034/1446 overflow-hidden bg-black text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Image src={pillar.image} alt={pillar.alt} fill sizes="(min-width: 768px) 28vw, 100vw" className={cn("-z-10 object-cover transition-transform duration-300 ease-out", isActive && "motion-safe:scale-110")} />
                <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-card-overlay)] transition-opacity duration-500 ease-out motion-reduce:transition-none", isActive ? "opacity-100" : "opacity-0")} />

                <div className="absolute inset-x-0 bottom-0 px-[10%] pb-[clamp(2rem,3vw,3.5rem)]">
                  <p className={cn("text-[clamp(1.75rem,1.75vw,2.25rem)] leading-none transition-colors duration-300 motion-reduce:transition-none", isActive ? "text-white" : "text-primary")}>{formatIndex(index)}</p>
                  <h3 className="mt-2text-[clamp(1rem,0.95vw,1.25rem)] leading-snug font-medium">{pillar.title}</h3>
                  <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <p className="overflow-hidden text-[clamp(1rem,0.95vw,1.25rem)] leading-snug font-light">
                      <span className="block pt-[clamp(1rem,1.5vw,1.75rem)]">{pillar.description}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
