import Image from "next/image";

export default function Opportunity() {
  return (
    <section aria-label="Our opportunity" className="relative isolate overflow-hidden bg-[image:var(--gradient-opportunity)] text-white">
      <Image src="/Image/home-opporunity.png" alt="" aria-hidden="true" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-card-overlay)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image src="/Icon/leaf-home-section-3.svg" alt="" width={468} height={504} className="absolute bottom-4 left-1/2 h-auto w-[70%] -translate-x-1/2 opacity-30 md:top-1/2 md:left-auto md:right-[5%] md:bottom-auto md:w-[26%] md:max-w-[500px] md:translate-x-0 md:-translate-y-1/2" />
      </div>
      <div className="relative mx-auto flex min-h-[95svh] max-w-[1920px] items-center px-8 py-12 md:min-h-[clamp(30rem,39vw,46rem)] md:px-[clamp(4rem,8.5vw,10rem)] md:py-28">
        <blockquote className="relative  max-w-[1100px] md:w-[73%]">
          <Image src="/Icon/quaote.svg" alt="" aria-hidden="true" width={247} height={196} className="pointer-events-none absolute -top-10 -left-4 w-24 md:-top-[clamp(3rem,5.5vw,6.5rem)] md:-left-6 md:w-[clamp(7rem,12vw,15rem)]" />
          <p className="relative text-[clamp(2.25rem,3.2vw,4rem)] leading-[1.3] font-normal">In a world of shifting geopolitical alignments, the Canada-India partnership can act as an anchor. Being built carefully and intentionally, it marks the beginning of an important chapter.</p>
        </blockquote>
      </div>
    </section>
  );
}
