import Image from "next/image";
import { investmentAreas } from "@/constants/investment";

export default function InvestmentOpportunities() {
  return (
    <section aria-labelledby="investment-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="grid grid-cols-1 gap-14 border-b border-neutral-200 pt-12 pb-16 lg:grid-cols-[minmax(0,1fr)_44%] lg:gap-[clamp(2rem,2.6vw,3rem)] lg:pt-[clamp(3rem,5.5vw,6.5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
          <div>
            <p className="text-base font-semibold text-primary lg:text-[clamp(1rem,1vw,1.25rem)]"><span className="mr-3">03</span>CURRENT INVESTMENT</p>
            <h2 id="investment-heading" className="mt-3 text-[clamp(2rem,2.9vw,3.5rem)] leading-tight font-semibold">INVESTMENT OPPORTUNITIES</h2>
            <p className="mt-8 max-w-[40rem] text-base leading-relaxed lg:mt-[clamp(2rem,2.6vw,3rem)] lg:text-[clamp(1rem,0.95vw,1.25rem)]">CISPF brings investors closer to the markets, businesses and decision-makers shaping these opportunities.</p>

            <ul className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:mt-[clamp(3rem,4.5vw,5.5rem)] lg:gap-[clamp(1rem,1vw,1.25rem)]">
              {investmentAreas.map((area) => (
                <li key={area.id} className="flex min-h-[10.5rem] flex-col justify-between gap-10 bg-[#F8F8F8] px-6 py-7 lg:min-h-[clamp(10rem,10.3vw,12.5rem)]">
                  <Image src={area.icon} alt="" aria-hidden="true" width={42} height={42} className="size-[clamp(2.25rem,2.1vw,2.625rem)] object-contain object-left" />
                  <p className="flex flex-col">
                    <span className="text-lg leading-snug font-semibold text-primary">{area.title}</span>
                    <span className="text-base leading-snug lg:text-[clamp(0.875rem,0.85vw,1rem)]">{area.description}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-690/1122 w-full overflow-hidden lg:aspect-auto">
            <Image src="/Image/opportunities-section-3-desktop.png" alt="Wind turbines above a solar farm and a field of yellow flowers" fill sizes="44vw" className="hidden object-cover lg:block" />
            <Image src="/Image/opportunities-section-3-mobile.png" alt="Wind turbines above a solar farm and a field of yellow flowers" fill sizes="100vw" className="object-cover lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
