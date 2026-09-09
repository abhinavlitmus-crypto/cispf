import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import PolicyCard from "@/components/common/PolicyCard/PolicyCard";
import { policyItems } from "@/constants/policy";

export default function PolicyDiscussions() {
  return (
    <section id="policy-discussions" aria-labelledby="policy-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,7vw,8rem)]">
        <h2 id="policy-heading" className="text-center text-[clamp(2rem,3.1vw,3.625rem)] leading-tight font-medium">POLICY DISCUSSIONS</h2>
        <div className="mt-10 grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-x-10">
          <PolicyCard item={policyItems[0]} />
          <div className="flex min-w-0 flex-col gap-12 sm:col-span-2 sm:row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:border-x lg:border-neutral-100 lg:px-5">
            <PolicyCard item={policyItems[1]} variant="landscape" />
            <PolicyCard item={policyItems[2]} variant="landscape" />
          </div>
          <div className="sm:col-start-2 sm:row-start-1 lg:col-start-3"><PolicyCard item={policyItems[3]} /></div>
        </div>
        <div className="mt-12 flex justify-center md:mt-20">
          {/* TODO: Replace with the policy listing route when available. */}
          <Button href="/#contact" className="group relative isolate max-w-full px-4 text-xs hover:brightness-100 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-primary before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100 focus-visible:before:opacity-100 motion-reduce:before:transition-none sm:px-6 sm:text-sm">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none">VIEW ALL POLICY DISCUSSIONS</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none"><ArrowRight className="size-6 shrink-0" strokeWidth={1.5} /></span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
