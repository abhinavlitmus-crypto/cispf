import Image from "next/image";
import { MoveRight } from "lucide-react";
import Button from "@/components/common/Button/Button";

function GrowthIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth={4} aria-hidden="true" className={className}>
      <path d="M62 2v16M18 140V18h87v74" />
      <path d="M28 35h27M28 52h27M28 67h27M28 83h27M28 99h27M28 115h27M65 35h30M65 52h30M65 67h30M65 83h30" />
      <path d="M2 140h63v18H2z" />
      <path d="M67 100v58h91" />
      <path d="m70 155 25-42 20 20 32-31" />
      <path d="m158 94-17 5 12 12z" fill="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

// Desktop: the animated corridor map fills the section and the text sits on its empty left side.
// Mobile: the text comes first and the map follows, cropped to the part with the countries.
export default function OurStory() {
  return (
    <section aria-labelledby="our-story-heading" className="relative isolate overflow-hidden bg-primary text-white lg:min-h-[52.35vw]">
      <div className="relative z-10 mx-auto max-w-[1920px] px-5 pt-14 pb-10 md:px-[clamp(1rem,8.6vw,10.5rem)] lg:pt-[clamp(4rem,8vw,10rem)] lg:pb-[clamp(4rem,6.5vw,8rem)]">
        <div className="max-w-[34rem] lg:w-[max(26vw,24rem)] lg:max-w-none">
          <h2 id="our-story-heading" className="text-[clamp(2.25rem,3.1vw,4rem)] leading-none font-medium">OUR STORY</h2>
          <p className="mt-5 text-[clamp(1.5rem,1.85vw,2.25rem)] leading-[1.3] lg:mt-[clamp(0.75rem,1vw,1.5rem)]">
            Built on a proven model.<br />Created for a <strong className="font-semibold">new corridor.</strong>
          </p>

          <div className="mt-10 border-y border-white/30 py-6 text-base leading-[1.7] lg:mt-[clamp(2rem,3vw,3.5rem)] lg:py-[clamp(1rem,1.25vw,1.5rem)] lg:text-[clamp(1rem,0.95vw,1.25rem)]">
            <p><strong className="font-semibold">CISPF</strong> brings the experience of <strong className="font-semibold">USISPF</strong> to a relationship with its own scale, complexity and opportunity.</p>
          </div>

          <div className="mt-10 flex items-center gap-5 lg:mt-[clamp(2rem,3.4vw,4rem)] lg:gap-[clamp(1rem,1.2vw,1.5rem)]">
            <GrowthIcon className="size-[4.5rem] shrink-0 lg:size-[clamp(4rem,4.3vw,5.5rem)]" />
            <p className="flex flex-col">
              <span className="text-[clamp(2.5rem,2.5vw,3.25rem)] leading-none font-semibold">450+</span>
              <span className="mt-1 text-[clamp(1.25rem,1.35vw,1.75rem)] leading-tight">global companies</span>
            </p>
          </div>
          <p className="mt-6 text-base leading-[1.7] lg:mt-[clamp(0.75rem,1vw,1.5rem)] lg:text-[clamp(1rem,0.95vw,1.25rem)]">
            form its network, helping shape one of the world’s most consequential economic corridors.
          </p>

          <Button href="https://usispf.org/" target="_blank" rel="noopener noreferrer" className="mt-10 gap-4 bg-white font-medium text-black lg:mt-[clamp(2.5rem,4.2vw,5rem)]">
            LEARN MORE ABOUT USISPF<MoveRight aria-hidden="true" strokeWidth={1.5} className="size-6" />
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        </div>
      </div>

      <div className="relative aspect-[1.3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <Image src="/svg/about-us.gif" alt="Map showing CISPF's new Canada–India corridor alongside the existing US–India corridor" fill unoptimized sizes="100vw" className="object-cover object-[88%_50%] lg:object-center" />
      </div>
    </section>
  );
}
