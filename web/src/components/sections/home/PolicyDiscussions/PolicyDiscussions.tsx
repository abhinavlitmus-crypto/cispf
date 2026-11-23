import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import PolicyCard, { PolicyComingSoonCard } from "@/components/common/PolicyCard/PolicyCard";
import type { PolicyItem } from "@/constants/policy";

const columns = 3;

export default function PolicyDiscussions({ items }: { items: PolicyItem[] }) {
  const recent = items.slice(0, columns);
  if (!recent.length) return null;

  return (
    <section id="policy-discussions" aria-labelledby="policy-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="policy-heading" className="w-fit text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium text-primary">RECENT POLICY DISCUSSIONS</h2>
          <Button href="/what-we-do/policy-discussions" className="group max-w-full shrink-0 px-4 text-xs sm:px-6 sm:text-sm">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none">VIEW ALL POLICY DISCUSSIONS</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none"><ArrowRight className="size-6 shrink-0" strokeWidth={1.5} /></span>
            </span>
          </Button>
        </div>
        {/* Always three columns on desktop; "Coming Soon" cards fill the slots without a discussion. */}
        <div className="mt-10 grid items-start gap-x-[clamp(1.25rem,1.8vw,2rem)] gap-y-12 sm:grid-cols-2 md:mt-[clamp(3rem,4.5vw,5.5rem)] lg:grid-cols-3">
          {recent.map((item) => <PolicyCard key={item.id} item={item} variant="square" />)}
          {Array.from({ length: columns - recent.length }, (_, index) => (
            <div key={index} className="hidden lg:block"><PolicyComingSoonCard /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
