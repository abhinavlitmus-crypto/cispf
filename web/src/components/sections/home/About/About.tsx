import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative bg-white text-black">
      <div className="mx-auto grid max-w-[1920px] gap-10 px-5 py-16 md:min-h-[clamp(42rem,48vw,58rem)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-[clamp(2rem,5vw,6rem)] md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)]">
        <div>
          <h2 id="about-heading" className="text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium">ABOUT CISPF</h2>
          <div className="mt-8 space-y-7 text-[clamp(1rem,0.98vw,1.125rem)] leading-[1.5] md:mt-10 md:space-y-10">
            <p className="font-normal">
              The Canada-India Strategic Partnership Forum (CISPF) is a not-for-profit organization working to help Canadian companies succeed in India by advancing pragmatic engagement across trade and investment.
            </p>
            <p className="font-light">
              CISPF is a platform for advancing the next phase of Canada–India economic engagement. We bring together business leaders, investors, policymakers and government to strengthen trade, unlock investment and build the relationships needed for sustained cross-border growth.
            </p>
            <p className="font-light">
              Building on the experience of the US-India Strategic Partnership Forum, CISPF brings a focused Canada–India lens to a relationship with growing economic and strategic significance.
            </p>
          </div>
          {/* TODO: Replace the contact destination when the About page is available. */}
          <Button href="/#contact" className="group relative isolate mt-10 max-w-full hover:brightness-100 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-primary before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100 focus-visible:before:opacity-100 motion-reduce:before:transition-none md:mt-16">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none tracking-wide">MORE ABOUT CISPF</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none">
                <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </Button>
        </div>
        <Image src="/Image/map.png" alt="Map of Canada and India connected by curved lines" width={2045} height={1387} sizes="(min-width: 1920px) 1050px, (min-width: 768px) 55vw, 100vw" className="h-auto w-full self-center" />
      </div>
    </section>
  );
}
