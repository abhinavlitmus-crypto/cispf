"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OpportunitiesVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => {
      if (visible && !reducedMotion.matches && !document.hidden) {
        void video.play().catch(() => { /* Leave the decorative first frame visible if autoplay is blocked. */ });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    // Above Header (z-40), below the mobile Sheet (z-50). Keep ancestors free of stacking contexts.
    <div id="opportunities" className="relative z-[45] flex h-[min(80svh,46rem)] min-h-80 items-end justify-center overflow-clip bg-secondary px-5 pb-12 md:h-[clamp(30rem,45vw,56rem)] md:pb-[clamp(3rem,5vw,6rem)]">
      <video ref={videoRef} autoPlay muted loop playsInline controls={false} disablePictureInPicture disableRemotePlayback preload="metadata" aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute inset-0 size-full object-cover">
        <source src="/videos/opporunities.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-button-gradient" />
      <Image src="/Icon/Leaf-opporunities.svg" alt="" aria-hidden="true" width={690} height={743} className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-30 brightness-0 invert md:h-[78%]" />
      {/* Bottom-sticky keeps the CTA in view until the panel’s lower edge carries it away.
          overflow-clip above clips decoration without creating a sticky scroll container.
          TODO: Point to the opportunities listing once that page is built. */}
      <Link href="/#contact" className="group sticky bottom-[10svh] inline-flex min-h-12 max-w-full items-center justify-center bg-white md:px-6 py-3 text-[clamp(0.6875rem,0.9vw,1rem)] font-medium focus-visible:outline-white">
        <span className="relative inline-flex items-center pr-8">
          <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent transition-transform duration-500 group-hover:translate-x-8 group-hover:bg-none group-hover:text-primary group-focus-visible:translate-x-8 group-focus-visible:bg-none group-focus-visible:text-primary motion-reduce:transition-none">EXPLORE ALL OPPORTUNITIES</span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end text-secondary transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-hover:text-primary group-focus-visible:translate-x-[calc(-100%+1.5rem)] group-focus-visible:text-primary motion-reduce:transition-none">
            <ArrowRight className="size-6 shrink-0 text-secondary transition-colors duration-500 group-hover:text-[color:var(--color-primary)] group-focus-visible:text-[color:var(--color-primary)] motion-reduce:transition-none" strokeWidth={1.5} />
          </span>
        </span>
      </Link>
    </div>
  );
}
