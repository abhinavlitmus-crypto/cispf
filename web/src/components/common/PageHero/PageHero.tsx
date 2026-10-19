import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PageHeroProps } from "@/utilities/ComponentTypes";

export default function PageHero({ id, title, description, image, gradient = false, border = true }: PageHeroProps) {
  return (
    <section aria-labelledby={id} className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className={cn("grid grid-cols-1 border-neutral-200 pt-14 lg:grid-cols-[minmax(0,1fr)_52%] lg:gap-[clamp(2rem,4vw,5rem)] lg:pt-[clamp(1.5rem,1.6vw,2rem)] lg:pb-[clamp(4rem,5.5vw,6.5rem)]", border && "lg:border-b")}>
          <div className="px-5 pb-20 text-center md:px-0 lg:self-center lg:pb-0 lg:text-left">
            <h1 id={id} className="gradient-text text-[clamp(2.25rem,3.9vw,4.5rem)] leading-tight font-semibold">{title}</h1>
            <p className="mx-auto mt-4 max-w-[34rem] text-base leading-relaxed lg:mx-0 lg:mt-[clamp(1.5rem,2.5vw,3rem)] lg:max-w-[40rem] lg:text-[clamp(1rem,0.95vw,1.25rem)]">{description}</p>
          </div>

          <div className="relative aspect-786/1006 w-full self-start overflow-hidden lg:aspect-1980/1384">
            {image.mobile ? (
              <>
                <Image src={image.desktop} alt={image.alt} fill fetchPriority="high" sizes="52vw" className="hidden object-cover lg:block" />
                <Image src={image.mobile} alt={image.alt} fill fetchPriority="high" sizes="100vw" className="object-cover lg:hidden" />
              </>
            ) : (
              <Image src={image.desktop} alt={image.alt} fill fetchPriority="high" sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            )}
            {gradient && <Image src="/Image/image-gradient.png" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 52vw, 100vw" className="pointer-events-none object-cover" />}
          </div>

          {border && <div aria-hidden="true" className="mx-5 mt-16 border-b border-neutral-200 md:mx-0 lg:hidden" />}
        </div>
      </div>
    </section>
  );
}
