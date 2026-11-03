import ContactPopup from "@/components/common/ContactPopup/ContactPopup";
import { cn } from "@/lib/utils";
import type { JoinUsProps } from "@/utilities/ComponentTypes";

const memberButtonClasses = [
  "transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

export default function JoinUs({ className }: JoinUsProps) {
  return (
    <section aria-labelledby="join-heading" className={cn("relative z-0 flex min-h-[22rem] flex-col items-center justify-center gap-6 bg-white px-5 py-20 text-center md:sticky md:top-0 md:min-h-[clamp(24rem,34vw,38rem)] md:justify-start md:gap-5 md:pt-[clamp(2.5rem,4vw,5rem)] md:pb-0 motion-reduce:static md:motion-reduce:static [@media(max-height:600px)]:static", className)}>
      <h2 id="join-heading" className="text-[clamp(1.75rem,3vw,3.5rem)] leading-tight font-medium">LET&rsquo;S BUILD THE FUTURE</h2>
      <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-500">Engage with the businesses, policymakers and institutions shaping the next phase of Canada–India relations.</p>
      <div className="mt-3 flex w-full max-w-lg justify-center">
        <ContactPopup triggerClassName={`${memberButtonClasses} min-w-[13.5rem] max-w-full cursor-pointer`}>CONTACT US</ContactPopup>
      </div>
    </section>
  );
}
