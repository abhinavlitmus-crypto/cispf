"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";

type StickyImageProps = {
  image: ImageProps["src"];
};

export default function StickyImage({ image }: StickyImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const photo = imageRef.current;
    if (!frame || !photo) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const update = () => {
      animationFrame = 0;
      if (reducedMotion.matches) {
        photo.style.transform = "none";
        return;
      }

      const bounds = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (bounds.bottom < 0 || bounds.top > viewportHeight) return;

      // Keep the slower-moving photo inside its crop throughout the scroll.
      const progress = Math.max(0, Math.min(1,
        (viewportHeight - bounds.top) / (viewportHeight + bounds.height),
      ));
      const travel = bounds.height * 0.2;
      photo.style.transform = `translate3d(0, ${(progress * 2 - 1) * travel}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(frame);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    update();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1920px] px-5 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
      <div ref={frameRef} className="relative aspect-[4/3] overflow-hidden md:aspect-[2.71/1]">
        <div ref={imageRef} className="absolute inset-x-0 -inset-y-[20%] motion-safe:will-change-transform">
          <Image src={image} alt="" fill sizes="(min-width: 1920px) 1820px, 95vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
