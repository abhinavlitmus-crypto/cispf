import OpportunitiesVideo from "./OpportunitiesVideo";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="sticky top-16 z-0 flex min-h-[clamp(23rem,28vw,34rem)] items-center bg-white px-5 py-16 text-center md:top-18 md:px-[clamp(1rem,2.6vw,3.125rem)] motion-reduce:static md:motion-reduce:static [@media(max-height:500px)]:static">
        <div className="mx-auto w-full max-w-[1820px]">
          <h1 id="hero-heading" className="mx-auto max-w-[1600px] bg-brand-gradient bg-clip-text text-[clamp(2.55rem,4.3vw,5.1rem)]  leading-[1.3] font-semibold text-transparent">
            CANADA AND INDIA<br className="hidden md:block" /> PARTNERS IN PROGRESS.
          </h1>
          <p lang="fr" className="mx-auto mt-4 max-w-[1600px] text-[clamp(1.25rem,2.3vw,2.75rem)] leading-relaxed text-neutral-300">Deux nations. Une nouvelle trajectoire.</p>
        </div>
      </div>
      <OpportunitiesVideo />
    </section>
  );
}
