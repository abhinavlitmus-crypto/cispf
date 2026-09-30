import Image from "next/image";
import { cn } from "@/lib/utils";
import { tradeStatGroups } from "@/constants/trade";

const statColumns: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function CurrentTrade() {
  return (
    <section id="current-trade" aria-labelledby="current-trade-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="border-b border-neutral-200 pt-12 pb-16 lg:pt-[clamp(3rem,4.75vw,5.5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_minmax(0,1fr)] lg:gap-[clamp(2rem,3.7vw,4.5rem)]">
            <div className="relative hidden aspect-1516/1180 w-full self-start overflow-hidden lg:block">
              <Image src="/Image/opporunities-section-1-image.jpg" alt="Shipping containers being loaded at a cargo port" fill sizes="40vw" className="object-cover" />
            </div>

            <div>
              <p className="text-base font-semibold text-primary lg:text-[clamp(1rem,1vw,1.25rem)]"><span className="mr-3">01</span>CURRENT TRADE</p>
              <h2 id="current-trade-heading" className="mt-3 text-[clamp(2rem,2.9vw,3.5rem)] leading-tight font-semibold">CANADA–INDIA TRADE</h2>

              <div className="mt-12 flex flex-col gap-8 border-neutral-200 lg:mt-[clamp(2rem,2.8vw,3.25rem)] lg:flex-row lg:items-center lg:justify-between lg:border-y lg:py-[clamp(2rem,2.6vw,3rem)]">
                <p className="leading-none">
                  <span className="flex items-baseline gap-3"><span className="text-[clamp(2.25rem,3.4vw,4rem)] font-semibold text-neutral-300">$30.9B</span><span className="text-xl lg:text-[clamp(1.25rem,1.9vw,2.25rem)]">today.</span></span>
                  <span className="mt-2 flex items-baseline gap-3"><span className="text-[clamp(3rem,4.2vw,5rem)] font-semibold text-primary">$70B</span><span className="text-[2.75rem] lg:text-[clamp(2.5rem,3.5vw,4.25rem)]">in sight.</span></span>
                </p>
                <Image src="/Image/opportunities-section-1-graph.png" alt="" aria-hidden="true" width={920} height={320} sizes="(min-width: 1024px) 24vw, 100vw" className="h-auto w-full lg:w-[46%]" />
              </div>

              <div className="mt-14 space-y-6 text-base leading-relaxed lg:mt-[clamp(2rem,2.8vw,3.25rem)] lg:text-[clamp(0.875rem,0.9vw,1.0625rem)]">
                <p>The Canada–India trade relationship has momentum. The bigger opportunity is what comes next.</p>
                <p>We help businesses understand where demand is growing, where market opportunities are opening and how to build stronger commercial connections across both markets.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-12 lg:mt-[clamp(3rem,3.8vw,4.5rem)] lg:space-y-[clamp(1.5rem,2.2vw,2.5rem)]">
            {tradeStatGroups.map((group) => (
              <div key={group.id} className="bg-[#F8F8F8] px-6 py-8 lg:px-[clamp(1.5rem,2.6vw,3rem)] lg:py-[clamp(2rem,2.8vw,3.25rem)]">
                <h3 className="text-lg font-medium">{group.title}</h3>
                <ul className={cn("mt-4 grid grid-cols-1 divide-y divide-neutral-200 lg:mt-[clamp(2rem,3vw,3.5rem)] lg:divide-x lg:divide-y-0", statColumns[group.stats.length])}>
                  {group.stats.map((stat) => (
                    <li key={stat.id} className="flex items-center gap-5 py-8 first:pt-4 last:pb-0 lg:px-[clamp(1rem,2.4vw,3rem)] lg:py-2 lg:first:pt-2 lg:first:pl-0 lg:last:pb-2">
                      <Image src={stat.icon} alt="" aria-hidden="true" width={71} height={66} className="h-auto w-[clamp(3.25rem,3.6vw,4.25rem)] shrink-0" />
                      <p className="flex flex-col">
                        <span className="text-[clamp(1.5rem,1.7vw,2rem)] leading-tight font-semibold text-primary">{stat.value}</span>
                        <span className="text-base leading-snug lg:text-[clamp(1rem,1.2vw,1.375rem)]">{stat.label}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
