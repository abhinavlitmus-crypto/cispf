import Image from "next/image";

export default function Opportunity() {
  return (
    <section aria-label="Our opportunity" className="relative isolate overflow-hidden bg-[image:var(--gradient-opportunity)] text-white">
      <Image src="/Image/home-opportunity-image.webp" alt="" aria-hidden="true" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#DA0808AD]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Figma: one large leaf centred behind the quote, about 78% of the section height. */}
        <Image src="/Icon/leaf-home-section-3.svg" alt="" width={468} height={504} className="absolute top-1/2 left-1/2 h-auto w-[75%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-30 md:h-[78%] md:w-auto md:max-w-none" />
      </div>
      <div className="relative mx-auto flex min-h-[80svh] max-w-[1920px] items-center justify-center px-6 py-16 md:min-h-[clamp(30rem,42.5vw,50rem)] md:px-[clamp(2rem,5vw,6rem)] md:py-24">
        <blockquote className="max-w-[1300px] text-center md:w-[74%]">
          <p className="text-[clamp(1.75rem,2.6vw,3.25rem)] leading-[1.3] font-normal">In a world of shifting geopolitical alignments, the Canada-India partnership can act as an anchor. Being built carefully and intentionally, it marks the beginning of an important chapter.</p>
        </blockquote>
      </div>
    </section>
  );
}
