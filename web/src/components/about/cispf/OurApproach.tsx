"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "CONNECT",
    tagline: "Put the right people in the room.",
    description: "We connect business leaders, investors, policymakers and institutions across both markets.",
  },
  {
    title: "CONVENE",
    tagline: "Create space for decisions, not just discussion.",
    description: "We bring senior stakeholders together around the issues that can move the relationship forward.",
  },
  {
    title: "INFORM",
    tagline: "Make a complex landscape easier to navigate.",
    description: "We surface market intelligence, policy developments and sector insights that inform better decisions.",
  },
  {
    title: "ENABLE",
    tagline: "Help opportunities move from conversation to action.",
    description: "We identify pathways, partnerships and practical solutions that can unlock cross-border growth.",
  },
];

// Desktop columns sit on a stepped wave rather than a flat row.
const columnOffsets = ["lg:mt-0", "lg:mt-[clamp(3rem,5.7vw,7rem)]", "lg:mt-[clamp(6rem,11vw,13.5rem)]", "lg:mt-[clamp(1.5rem,2.9vw,3.5rem)]"];

export default function OurApproach() {
  const listRef = useRef<HTMLUListElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="our-approach-heading" className="overflow-hidden bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(3rem,4vw,5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
        <h2 id="our-approach-heading" className="text-[clamp(2.5rem,3.6vw,4.25rem)] leading-tight font-medium lg:text-center">
          OUR APPROACH
        </h2>

        <ul
          ref={listRef}
          onMouseLeave={() => setActiveIndex(null)}
          className="mt-14 grid grid-cols-1 gap-24 lg:mt-[clamp(3rem,5vw,6rem)] lg:grid-cols-4 lg:gap-0"
        >
          {data.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <li
                key={item.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                style={{ transitionDelay: isVisible ? `${index * 150}ms` : undefined }}
                className={cn(
                  "flex flex-col outline-none transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none lg:pr-[clamp(1rem,2vw,3rem)]",
                  columnOffsets[index],
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
                )}
              >
                <h3
                  className={cn(
                    "border-l-[3px] border-transparent pl-6 text-[clamp(2.5rem,10vw,3rem)] leading-none font-medium transition-colors duration-300 [border-image:var(--gradient-brand-vertical)_1] lg:pl-[clamp(0.75rem,1.1vw,1.25rem)] lg:text-[clamp(1.75rem,2.2vw,2.75rem)]",
                    isActive ? "text-black" : "text-primary",
                  )}
                >
                  {item.title}
                </h3>

                <div className="ml-px flex flex-1 flex-col border-l border-neutral-200 pl-[calc(1.5rem+2px)] lg:pl-[calc(clamp(0.75rem,1.1vw,1.25rem)+2px)]">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-8 ml-[clamp(2rem,10vw,3.5rem)] text-[clamp(10rem,45vw,12rem)] leading-none font-semibold transition-[color,translate] duration-500 ease-out lg:mt-[clamp(1.5rem,2.8vw,3.5rem)] lg:ml-[clamp(1.5rem,2.3vw,3rem)] lg:text-[clamp(6rem,8vw,10rem)]",
                      isActive ? "text-neutral-200 lg:-translate-y-2" : "text-neutral-100",
                    )}
                  >
                    {index + 1}
                  </span>

                  <div
                    className={cn(
                      "mt-16 pb-2 transition-transform duration-500 ease-out motion-reduce:transition-none lg:mt-[clamp(6rem,9vw,11rem)]",
                      isActive && "lg:-translate-y-[clamp(3rem,5vw,6rem)]",
                    )}
                  >
                    <p
                      className={cn(
                        "max-w-[22rem] text-2xl leading-snug font-medium transition-colors duration-300 lg:text-[clamp(1.125rem,1.35vw,1.625rem)]",
                        isActive ? "lg:text-primary" : "lg:text-neutral-300",
                      )}
                    >
                      {item.tagline}
                    </p>
                    <p className="mt-6 max-w-[26rem] text-lg leading-relaxed font-light lg:mt-[clamp(1rem,1.2vw,1.5rem)] lg:text-[clamp(0.875rem,1vw,1.125rem)] lg:font-normal">
                      {item.description}
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
