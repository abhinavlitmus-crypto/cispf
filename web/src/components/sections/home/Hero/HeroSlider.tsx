"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";


const slides = [
  "/Image/slider/slider-1.webp",
  "/Image/slider/slider-2.webp",
  "/Image/slider/slider-3.webp",
  "/Image/slider/slider-4.webp",
  "/Image/slider/slider-5.webp",
  "/Image/slider/slider-6.webp",
  "/Image/slider/slider-7.webp",
  "/Image/slider/slider-8.webp",
  "/Image/slider/slider-9.webp",
  "/Image/slider/slider-10.webp",
  "/Image/slider/slider-11.webp",
  "/Image/slider/slider-12.webp",
  "/Image/slider/slider-13.webp",
  "/Image/slider/slider-14.webp",
  "/Image/slider/slider-15.webp",
  "/Image/slider/slider-16.webp",
  "/Image/slider/slider-17.webp",
  "/Image/slider/slider-18.webp",
  "/Image/slider/slider-19.webp",
  "/Image/slider/slider-20.webp",
  "/Image/slider/slider-21.webp",
  "/Image/slider/slider-22.webp",
  "/Image/slider/slider-23.webp",
  "/Image/slider/slider-24.webp",
  "/Image/slider/slider-25.webp",
];

// Fills its positioned parent; the parent's gradient and leaf sit on top of the photos.
export default function HeroSlider() {
  const slider = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="CISPF event photos" className="absolute inset-0">
      <Swiper
        modules={[A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        // Continues from the last photo straight on to the first.
        loop
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSwiper={(instance) => {
          slider.current = instance;
          // Visitors who prefer reduced motion change photos with the dots instead.
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) instance.autoplay.stop();
        }}
        // Loop mode reorders slides, so realIndex is the photo's position in `slides`.
        onRealIndexChange={(instance) => setActive(instance.realIndex)}
        className="h-full w-full"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={src} className="relative h-full">
            <Image src={src} alt="" fill sizes="100vw" fetchPriority={index === 0 ? "high" : undefined} loading={index === 0 ? "eager" : "lazy"} className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center px-5 md:bottom-[clamp(1rem,2vw,2rem)]">
        <div role="group" aria-label="Choose slide" className="flex flex-wrap items-center justify-center">
          {slides.map((src, index) => (
            <button key={src} type="button" aria-label={`Show photo ${index + 1} of ${slides.length}`} aria-current={active === index ? "true" : undefined} onClick={() => slider.current?.slideToLoop(index)} className="flex min-h-11 min-w-6 cursor-pointer items-center justify-center focus-visible:outline-white">
              <span aria-hidden="true" className={`h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === index ? "w-7 bg-white" : "w-1.5 bg-white/50"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
