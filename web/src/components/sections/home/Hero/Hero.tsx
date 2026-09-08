import OpportunitiesVideo from "./OpportunitiesVideo";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="sticky top-16 z-0 flex min-h-[clamp(23rem,28vw,34rem)] items-center bg-white px-5 py-16 md:top-18 md:px-[clamp(1rem,2.6vw,3.125rem)] motion-reduce:static md:motion-reduce:static [@media(max-height:500px)]:static">
        <div className="mx-auto w-full max-w-[1820px]">
          {/* One gradient canvas keeps the color aligned horizontally across every line. */}
          <h1 id="hero-heading" className="w-fit max-w-[1600px] bg-brand-gradient bg-clip-text text-[clamp(2rem,3.45vw,4rem)] leading-[1.3] font-medium text-transparent">
            <span lang="fr" className="bg-white text-neutral-300">DEUX NATIONS. UNE NOUVELLE<br className="hidden md:block" /> TRAJECTOIRE. </span>
            <span>CANADA AND INDIA, MOVING<br className="hidden md:block" /> FORWARD TOGETHER.</span>
          </h1>
        </div>
      </div>
      <OpportunitiesVideo />
    </section>
  );
}
