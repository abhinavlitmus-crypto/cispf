"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { BackgroundVideoProps } from "@/utilities/ComponentTypes";

export default function BackgroundVideo({ src, poster }: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    // preload="none" means nothing is downloaded until the first play() once the video scrolls into view.
    const syncPlayback = () => {
      if (visible && !reducedMotion.matches && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(container);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Optimized poster shows through until the first video frame paints. */}
      {poster && <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />}
      <video ref={videoRef} src={src} muted loop playsInline preload="none" disablePictureInPicture disableRemotePlayback tabIndex={-1} className="relative size-full object-cover" />
    </div>
  );
}
