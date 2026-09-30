import Image from "next/image";

// TODO: Replace the partner names with the approved partner logos.
const partners = ["Invest Alberta", "Invest Ottawa", "Invest India"];

export default function PartnersInProgress() {
  return (
    <section aria-labelledby="partners-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(3rem,5.5vw,6.5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
        <div className="lg:text-center">
          <p className="text-base font-semibold text-primary lg:text-[clamp(1rem,1vw,1.25rem)]"><span className="mr-3">04</span>PROVINCES IN THE PLAY</p>
          <h2 id="partners-heading" className="mt-3 text-[clamp(2rem,2.9vw,3.5rem)] leading-tight font-semibold">PARTNERS IN PROGRESS</h2>
        </div>

        {/* Mobile keeps the image at the top of the card and lets the content overlap its faded edge. */}
        <div className="relative isolate mt-12 bg-black px-9 pt-[72%] pb-14 text-white lg:mt-[clamp(3rem,3.6vw,4.25rem)] lg:flex lg:aspect-3640/1574 lg:w-full lg:flex-col lg:justify-center lg:px-[clamp(2rem,4.4vw,5.25rem)] lg:py-[clamp(3rem,5vw,6rem)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 aspect-690/666 overflow-hidden lg:inset-0 lg:aspect-auto">
            <Image src="/Image/opportunities-section-4-image-desktop.webp" alt="" fill sizes="92vw" className="hidden object-cover lg:block" />
            <Image src="/Image/opportunities-section-4-image-mobile.png" alt="" fill sizes="100vw" className="object-cover lg:hidden" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,#000_100%)] lg:hidden" />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[clamp(3rem,8vw,10rem)]">
            <h3 className="text-[clamp(1.625rem,2.5vw,3rem)] leading-[1.25] font-semibold">BUSINESS MOVES FASTER WHEN THE RIGHT PEOPLE ARE CONNECTED.</h3>
            <div className="space-y-6 text-base leading-snug lg:text-[clamp(0.875rem,0.95vw,1.125rem)]">
              <p>CISPF brings together the institutions, businesses and leaders that can turn a promising market opportunity into a meaningful partnership.</p>
              <p>From investment agencies to business networks, our partners extend reach across sectors, regions and markets.</p>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-8 border-t border-white/25 pt-14 lg:mt-[clamp(3rem,8vw,10rem)] lg:flex-row lg:items-center lg:gap-[clamp(3rem,7vw,8.5rem)] lg:pt-[clamp(2rem,3vw,3.5rem)]">
            <p id="partners-list-label" className="text-lg font-semibold lg:text-[clamp(1rem,1.1vw,1.375rem)]">Our Partners :</p>
            <ul aria-labelledby="partners-list-label" className="flex flex-col gap-8 lg:flex-row lg:gap-[clamp(3rem,4.5vw,5.5rem)]">
              {partners.map((partner) => <li key={partner} className="text-lg font-semibold lg:text-[clamp(1rem,1.1vw,1.375rem)]">{partner}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
