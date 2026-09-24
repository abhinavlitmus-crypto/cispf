import BackgroundVideo from "@/components/common/BackgroundVideo/BackgroundVideo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OpportunitiesVideo() {
  return (
    // Above Header (z-40), below the mobile Sheet (z-50). Keep ancestors free of stacking contexts.
    <div id="opportunities" className="relative z-[45] flex h-[min(80svh,46rem)] min-h-80 items-end justify-center overflow-clip  px-5 pb-12 md:h-[clamp(30rem,45vw,56rem)] md:pb-[clamp(3rem,5vw,6rem)]">
      <BackgroundVideo src="/videos/opporunities.mp4" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-opportunities-gradient" />
      <Image src="/Icon/Leaf-opporunities.svg" alt="" aria-hidden="true" width={690} height={743} className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain   md:h-[80%]" />
      {/* Bottom-sticky keeps the CTA in view until the panel’s lower edge carries it away.
          overflow-clip above clips decoration without creating a sticky scroll container.
          TODO: Point to the opportunities listing once that page is built. */}
      {/* <Link href="/#contact" className="group sticky bottom-[10svh] inline-flex min-h-12 max-w-full items-center justify-center bg-white px-5 py-3 md:px-6 text-[clamp(0.6875rem,0.9vw,1rem)] font-medium focus-visible:outline-white">
        <span className="relative inline-flex items-center pr-8">
          <span className="text-primary transition-transform duration-500 group-hover:translate-x-8 group-focus-visible:translate-x-8 motion-reduce:transition-none">Learn More About CISPF</span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end text-primary transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none">
            <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} />
          </span>
        </span>
      </Link> */}
    </div>
  );
}
