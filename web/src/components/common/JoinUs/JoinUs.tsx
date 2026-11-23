import Image from "next/image";
import ContactPopup from "@/components/common/ContactPopup/ContactPopup";
import { cn } from "@/lib/utils";
import type { JoinUsProps } from "@/utilities/ComponentTypes";

const memberButtonClasses = [
  "transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

export default function JoinUs({ className }: JoinUsProps) {
  return (
    <section aria-labelledby="join-heading" className={cn("relative flex flex-col items-center gap-6 bg-white px-5 pt-20 text-center md:gap-5 md:pt-[clamp(4rem,9vw,10rem)]", className)}>
      <h2 id="join-heading" className="text-[clamp(1.75rem,3vw,3.5rem)] leading-tight font-medium">LET&rsquo;S BUILD THE FUTURE</h2>
      <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-500">Engage with the businesses, policymakers and institutions shaping the next phase of Canada–India relations.</p>
      <div className="relative z-10 mt-3 flex w-full max-w-lg justify-center md:mt-[clamp(1.5rem,3vw,3.5rem)]">
        <ContactPopup triggerClassName={`${memberButtonClasses} min-w-[13.5rem] max-w-full cursor-pointer`}>CONTACT US</ContactPopup>
      </div>
      {/* Toronto and India skylines sit on the footer; on desktop their tops rise beside the button.
          The PNGs have transparent edges (left image: right 17%, right image: left 7.5%), so the boxes
          overlap by 8% to leave the Figma's small gap between the visible cities.
          Both PNGs also end in 2 transparent rows; translate-y pushes those under the footer so no white line shows. */}
      <div aria-hidden="true" className="pointer-events-none -mx-5 flex w-[calc(100%+2.5rem)] items-end pt-6 md:-mt-[8.5vw] md:pt-0">
        <Image src="/svg/city-left.png" alt="" width={1097} height={419} sizes="57vw" className="h-auto w-[57%] shrink-0 translate-y-[0.7%]" />
        <Image src="/svg/city-right.png" alt="" width={983} height={404} sizes="51vw" className="-ml-[8%] h-auto w-[51%] shrink-0 translate-y-[0.7%]" />
      </div>
    </section>
  );
}
