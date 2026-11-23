import BackgroundVideo from "@/components/common/BackgroundVideo/BackgroundVideo";
import Button from "@/components/common/Button/Button";
import { connectLink } from "@/constants/navigation";

// Full-screen banner video behind the headline. On desktop the transparent header sits on top of it.
export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate flex h-[calc(100svh-4rem)] min-h-[28rem] items-center justify-center overflow-hidden bg-black px-5 text-center text-white md:h-svh md:min-h-[36rem] md:px-[clamp(1rem,2.6vw,3.125rem)]">
      <BackgroundVideo src="/videos/CISPF-Banner-Video.mp4" />
      {/* An even dark tint plus the Figma gradient, which fades to black towards the bottom, keep the white text readable. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/35 bg-[image:var(--gradient-hero-overlay)]" />
      <div className="relative mx-auto w-full max-w-[1600px] pb-[8svh]">
        <h1 id="hero-heading" className="text-[clamp(2.25rem,3.5vw,4.25rem)] leading-[1.2] font-medium">
          SHAPING STABLE PARTNERSHIPS <br className="hidden md:block" /> IN A CHANGING WORLD
        </h1>
        <p lang="fr" className="mt-6 text-[clamp(1.125rem,1.45vw,1.75rem)] leading-relaxed text-white/85 md:mt-[clamp(2rem,3.4vw,4rem)]">Deux nations.<br className="md:hidden" /> Une nouvelle trajectoire.</p>
        <Button href={connectLink.href} className="mt-8 transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 md:hidden">{connectLink.label}</Button>
      </div>
    </section>
  );
}
