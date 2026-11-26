import Image from "next/image";
import { LuChevronsDown } from "react-icons/lu";

// Full-screen photo hero with the same dark overlay as the home page hero. On desktop the transparent header sits on top of it.
export default function HeroSection() {
  return (
    <section aria-labelledby="about-cispf-heading" className="relative isolate flex h-[calc(100svh-4rem)] min-h-[28rem] items-center overflow-hidden bg-black px-5 text-white md:h-svh md:min-h-[36rem] md:px-[8.5vw]">
      <Image src="/about/hero-bg.webp" alt="" fill fetchPriority="high" sizes="100vw" className="-z-10 object-cover object-[68%_50%] md:object-center" />
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/01 bg-[image:var(--gradient-hero-overlay)]" /> */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/01 bg-[image:var(--gradient-hero-overlay)]" />

      <div className="w-full max-w-[34rem] pb-[14svh] md:max-w-[max(25vw,28rem)]">
        <h1 id="about-cispf-heading" className="text-[clamp(2.5rem,3.4vw,4.5rem)] leading-tight font-medium">ABOUT CISPF</h1>
        <p className="mt-4 text-base leading-relaxed text-white/90 md:mt-[clamp(1rem,1.3vw,1.75rem)] md:leading-normal md:text-[clamp(1rem,0.95vw,1.375rem)]">
          The Canada–India Strategic Partnership Forum (CISPF) is an independent, non-partisan organization dedicated to strengthening commercial, strategic, and people-to-people ties between Canada and India.
        </p>
      </div>

      {/* Decorative scroll hint: animation only, not a control. */}
      {/* <LuChevronsDown aria-hidden="true" className="absolute bottom-[6svh] left-1/2 size-6 -translate-x-1/2 animate-scroll-hint motion-reduce:animate-none" /> */}
    </section>
  );
}
