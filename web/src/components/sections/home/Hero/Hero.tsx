import Button from "@/components/common/Button/Button";
import { connectLink } from "@/constants/navigation";
import OpportunitiesVideo from "./OpportunitiesVideo";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="sticky top-16 z-0 flex min-h-[clamp(23rem,28vw,34rem)] items-center bg-white px-5 py-16 text-center md:top-18 md:px-[clamp(1rem,2.6vw,3.125rem)] motion-reduce:static md:motion-reduce:static [@media(max-height:500px)]:static">
        <div className="mx-auto w-full max-w-[1820px]">
          <h1 id="hero-heading" className="mx-auto max-w-[1600px] text-[clamp(2.25rem,4.3vw,5.1rem)] leading-[1.3] text-primary font-semibold">
            {/* CANADA AND <br className="block md:hidden"/> INDIA<br className="hidden md:block" /> PARTNERS <br className=" md:hidden"/> IN PROGRESS */}
            SHAPING STABLE PARTNERSHIPS <br className="hidden md:block" /> IN A CHANGING WORLD
          </h1>
          <p lang="fr" className="mx-auto mt-4 max-w-[1600px] text-[clamp(1.25rem,2.3vw,2.75rem)] leading-relaxed text-neutral-300">Deux nations.<br className="md:hidden" /> Une nouvelle trajectoire.</p>
          <Button href={connectLink.href} className="mt-8 transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 md:hidden">{connectLink.label}</Button>
        </div>
      </div>
      <OpportunitiesVideo />
    </section>
  );
}
