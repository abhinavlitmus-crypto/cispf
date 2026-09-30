"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { BackgroundVideoProps } from "@/utilities/ComponentTypes";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function BackgroundVideo({ src }: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => setPlaying(visible && !reducedMotion.matches && !document.hidden);
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
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden [&_video]:size-full [&_video]:object-cover">
      <ReactPlayer src={src} playing={playing} muted volume={0} loop playsInline controls={false} pip={false} disablePictureInPicture disableRemotePlayback preload="metadata" tabIndex={-1} width="100%" height="100%" style={{ objectFit: "cover" }} />
    </div>
  );
}
