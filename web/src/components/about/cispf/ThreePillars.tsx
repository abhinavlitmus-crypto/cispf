"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "ECONOMIC & COMMERCIAL WORK",
    image: "/about/pillar1.svg",
    alt: "Container ship loaded with cargo sailing across the ocean",
    description: "Advancing trade, investment and business-friendly policy to unlock the full potential of the Canada–India economic corridor.",
  },
  {
    title: "GEOPOLITICAL & SECURITY CONVERGENCE",
    image: "/about/pillar2.svg",
    alt: "Engineer holding a laptop inside a high-tech facility",
    description: "Aligning strategic interests on security, technology and supply-chain resilience across the Indo-Pacific and beyond.",
  },
  {
    title: "PEOPLE-TO-PEOPLE TIES",
    image: "/about/pillar3.svg",
    alt: "People from Canada and India connecting together",
    description: "Strengthening the education, cultural and diaspora links that form the foundation of the Canada–India relationship.",
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

export default function ThreePillars() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="three-pillars-heading" className="overflow-hidden bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(4rem,6vw,7rem)] lg:pb-[clamp(3rem,4vw,5rem)]">
        <h2 id="three-pillars-heading" className="text-center text-[clamp(2.5rem,3.6vw,4.25rem)] leading-tight font-medium text-primary">
          OUR THREE PILLARS
        </h2>

        {/* Mobile: every pillar is shown with its image, alternating sides */}
        <ul className="mt-14 lg:hidden">
          {data.map((pillar, index) => (
            <li key={pillar.title} className="grid grid-cols-2 items-start gap-8 border-b border-neutral-200 py-14 first:pt-0 last:border-b-0 last:pb-0">
              <div className={cn("pt-4", index % 2 === 1 && "order-2")}>
                <p className="text-2xl text-primary">{formatIndex(index)}</p>
                <h3 className="mt-4 text-[clamp(1.25rem,5vw,1.75rem)] leading-snug font-medium">{pillar.title}</h3>
              </div>
              <div className={cn("relative aspect-274/378 w-full overflow-hidden", index % 2 === 1 && "order-1")}>
                <Image src={pillar.image} alt={pillar.alt} fill sizes="50vw" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop: hovering a pillar reveals its tilted image and description */}
        <ul className="relative mt-[clamp(2rem,3vw,3.5rem)] hidden lg:block" onMouseLeave={() => setActiveIndex(null)}>
          <span aria-hidden="true" className="absolute top-0 left-0 w-[68%] border-t border-neutral-200" />
          {data.map((pillar, index) => {
            const isActive = activeIndex === index;
            const isImageLeft = index % 2 === 0;
            return (
              <li
                key={pillar.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className={cn(
                  "relative flex min-h-[clamp(10rem,10.4vw,12.5rem)] items-center justify-center outline-none transition-[padding] duration-500 ease-out",
                  isActive && (isImageLeft ? "pl-[clamp(10rem,13vw,16rem)]" : "pr-[clamp(10rem,13vw,16rem)]"),
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("absolute bottom-0 border-t border-neutral-200", index % 2 === 0 ? "right-0 left-[30%]" : "right-[24%] left-0")}
                />

                <div
                  className={cn(
                    "pointer-events-none absolute top-1/2 z-10 aspect-274/330 w-[clamp(8rem,10.5vw,13rem)] -translate-y-1/2 transition-all duration-500 ease-out",
                    isImageLeft ? "left-[2%]" : "right-[2%]",
                    isActive ? (isImageLeft ? "-rotate-15" : "rotate-15") : isImageLeft ? "-rotate-6" : "rotate-6",
                    isActive ? "opacity-100" : "scale-90 opacity-0",
                  )}
                >
                  <Image src={pillar.image} alt={pillar.alt} fill sizes="13vw" className="object-cover" />
                </div>

                <h3 className="text-[clamp(1.5rem,2.1vw,2.5rem)] leading-tight font-medium whitespace-nowrap">
                  <span className={cn("mr-3 transition-colors duration-300", isActive ? "text-black" : "text-primary")}>{formatIndex(index)}</span>
                  <span className={cn("transition-colors duration-300", isActive ? "text-primary" : "text-black")}>{pillar.title}</span>
                </h3>

                <p
                  className={cn(
                    "overflow-hidden text-[clamp(0.875rem,0.95vw,1.125rem)] leading-relaxed transition-all duration-500 ease-out",
                    isActive ? "ml-[clamp(2rem,4.5vw,6rem)] max-w-[clamp(16rem,24vw,30rem)] opacity-100" : "ml-0 max-w-0 opacity-0",
                  )}
                >
                  <span className="block w-[clamp(16rem,24vw,30rem)]">{pillar.description}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
