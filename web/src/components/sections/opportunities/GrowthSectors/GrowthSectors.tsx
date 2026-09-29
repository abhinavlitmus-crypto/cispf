import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectorCorridors } from "@/constants/sectors";

const imageClasses = "object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100";

export default function GrowthSectors() {
  return (
    <section aria-labelledby="growth-sectors-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="border-b border-neutral-200 pt-12 pb-16 lg:pt-[clamp(3rem,5.5vw,6.5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
          <div className="lg:text-center">
            <p className="text-base font-medium text-primary lg:text-[clamp(1rem,1vw,1.25rem)]"><span className="mr-3">02</span>SECTORS WITH POTENTIAL</p>
            <h2 id="growth-sectors-heading" className="mt-3 text-[clamp(2rem,2.9vw,3.5rem)] leading-tight font-semibold">SECTORS WITH GROWTH POTENTIAL</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-[clamp(3rem,3.6vw,4.25rem)] lg:grid-cols-2 lg:gap-[clamp(1.5rem,2.4vw,3rem)]">
            {sectorCorridors.map((corridor) => {
              const end = corridor.align === "end";
              return (
                <article key={corridor.id} aria-labelledby={`${corridor.id}-heading`} className="group relative isolate flex flex-col justify-between gap-16 bg-neutral-900 px-6 py-10 text-white aspect-690/1138 w-full self-stretch lg:aspect-1772/1236 lg:px-[clamp(1.5rem,2.6vw,3rem)] lg:py-[clamp(2rem,3.2vw,3.75rem)]">
                  <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                    <Image src={corridor.image} alt="" fill sizes="46vw" className={cn("hidden lg:block", imageClasses)} />
                    <Image src={corridor.imageMobile} alt="" fill sizes="100vw" className={cn("lg:hidden", imageClasses)} />
                    <div className="absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none" />
                  </div>

                  <h3 id={`${corridor.id}-heading`} className={cn("flex items-center gap-3 text-[clamp(1.625rem,2.1vw,2.5rem)] leading-tight font-medium", end && "lg:justify-end")}>
                    {corridor.from}<ArrowRight aria-hidden="true" className="size-[0.8em]" /><span className="sr-only">to</span>{corridor.to}
                  </h3>

                  <ul className="space-y-6 lg:space-y-[clamp(1rem,1.9vw,2.25rem)]">
                    {corridor.sectors.map((sector) => (
                      <li key={sector.id} className={cn("flex items-center gap-4", end && "lg:flex-row-reverse lg:text-right")}>
                        <Image src={sector.icon} alt="" aria-hidden="true" width={36} height={38} className="h-[clamp(2rem,1.9vw,2.25rem)] w-[clamp(2rem,1.9vw,2.25rem)] shrink-0 object-contain" />
                        <p className="flex flex-col">
                          <span className="text-base font-medium lg:text-[clamp(1rem,1vw,1.25rem)]">{sector.title}</span>
                          <span className="text-sm leading-snug lg:text-[clamp(0.8125rem,0.8vw,0.9375rem)]">{sector.description}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
