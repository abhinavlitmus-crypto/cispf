import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative overflow-hidden bg-white text-black">
      {/* Desktop: the map sits right of the text and runs off the right edge, as in the Figma.
          unoptimized keeps the GIF animated. */}
      <Image src="/svg/map.gif" alt="World map highlighting Canada and India" width={1492} height={914} unoptimized className="pointer-events-none absolute top-1/2 left-[37%] hidden h-auto w-[78%] max-w-none -translate-y-[44%] lg:block" />
      <div className="relative mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)] lg:min-h-[clamp(40rem,50vw,58rem)] lg:py-[clamp(5rem,9vw,10rem)]">
      <div className="lg:max-w-[min(38rem,33vw)]">
        <h2 id="about-heading" className="text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium text-primary">ABOUT CISPF</h2>
        <div className="mt-8 space-y-7 text-[clamp(1rem,0.98vw,1.125rem)] leading-[1.6] md:mt-[clamp(2.5rem,3.5vw,4rem)] md:space-y-[clamp(1.75rem,2.6vw,3rem)]">
          <p className="font-normal">
            The Canada-India Strategic Partnership Forum (CISPF) is a not-for-profit organization working to help Canadian companies succeed in India by advancing pragmatic engagement across trade and investment.
          </p>
          <p className="font-light">
            CISPF is a platform for advancing the next phase of Canada–India economic engagement. We bring together business leaders, investors, policymakers and government to strengthen trade, unlock investment and build the relationships needed for sustained cross-border growth.
          </p>
          <p className="font-light">
            Building on the experience of the <a href="https://usispf.org/" target="_blank" className="underline">US-India Strategic Partnership Forum</a>, CISPF brings a focused Canada–India lens to a relationship with growing economic and strategic significance.
          </p>
        </div>
        {/* TODO: Replace the contact destination when the About page is available. */}
        <Button href="/about/cispf" className="group mt-10 max-w-full md:mt-[clamp(3rem,4vw,4.5rem)]">
          <span className="relative inline-flex items-center pr-10">
            <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none tracking-wide">LEARN MORE ABOUT CISPF</span>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none">
              <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} />
            </span>
          </span>
        </Button>
      </div>
      {/* Smaller screens: the map follows the text, full width. */}
      <Image src="/svg/map.gif" alt="" width={1492} height={914} unoptimized className="mt-12 h-auto w-full lg:hidden" />
      </div>
    </section>
  );
}
