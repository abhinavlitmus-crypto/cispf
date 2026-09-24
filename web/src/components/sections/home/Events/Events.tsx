"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import EventCard from "@/components/common/EventCard/EventCard";
import { eventItems, type EventCategory } from "@/constants/events";

const tabs = [
  { value: "upcoming", label: "UPCOMING EVENTS" },
  { value: "past", label: "PAST EVENTS" },
] as const;
// The grouping changes at the same breakpoint as the card layout.
function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getDesktopSnapshot = () => window.matchMedia("(min-width: 1024px)").matches;
const getServerSnapshot = () => true;

export default function Events() {
  const desktop = useSyncExternalStore(subscribeToViewport, getDesktopSnapshot, getServerSnapshot);
  const pageSize = desktop ? 4 : 1;
  const slider = useRef<Partial<Record<EventCategory, SwiperInstance>>>({});
  const [category, setCategory] = useState<EventCategory>("upcoming");
  const [page, setPage] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = eventItems[category];
  const pageCount = Math.ceil(items.length / pageSize);
  const firstDot = Math.min(Math.max(page - 1, 0), Math.max(pageCount - 4, 0));

  function selectTab(value: EventCategory) {
    if (value === category) return;
    slider.current[value]?.slideTo(0, 0);
    setCategory(value);
    setPage(0);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next].value);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="events" aria-label="Events" className="relative isolate overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] md:h-[clamp(28rem,36vw,43rem)]">
        <Image src="/Image/home-upcoming-past-event-bg.png" alt="" fill sizes="100vw" className="hidden object-cover object-top grayscale lg:block" />
        <Image src="/Image/home-upcoming-past-event-mobile.png" alt="" fill sizes="100vw" className="object-cover object-top grayscale lg:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_45%,#000_100%)]" />
      </div>
      <div className="mx-auto grid grid-cols-1 xl:grid-cols-[1fr_auto] max-w-[1920px] px-5 pt-44 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(10rem,19vw,23rem)] md:pb-[clamp(4rem,7vw,8rem)]">

          <div role="tablist" aria-label="Event category" className="flex items-end justify-between gap-5 lg:justify-start lg:gap-8">
            {tabs.map((tab, index) => (
              <button key={tab.value} ref={(node) => { tabRefs.current[index] = node; }} id={`events-tab-${tab.value}`} type="button" role="tab" aria-selected={category === tab.value} aria-controls={`events-panel-${tab.value}`} tabIndex={category === tab.value ? 0 : -1} onClick={() => selectTab(tab.value)} onKeyDown={(event) => onTabKeyDown(event, index)} className={`min-h-11 max-w-[60%] lg:max-w-none text-left font-medium transition-[color,font-size] duration-500 ease-in-out focus-visible:outline-white motion-reduce:transition-none cursor-pointer ${category === tab.value ? "text-[clamp(2rem,3vw,3.5rem)] text-white" : "text-[clamp(1.125rem,2vw,2.25rem)] text-white/55 hover:text-white"}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="order-last mt-10 flex flex-col items-center gap-10 xl:order-none xl:mt-0 xl:flex-row xl:gap-5">
            <div role="group" aria-label="Event pages" className="flex max-w-full flex-wrap items-center justify-center">
              <button type="button" disabled={page === 0} onClick={() => slider.current[category]?.slidePrev()} aria-label="Previous event page" className="mr-3 flex size-11 items-center justify-center cursor-pointer bg-primary disabled:opacity-30"><ArrowLeft aria-hidden="true" className="size-5" /></button>
              {Array.from({ length: Math.min(4, pageCount) }, (_, offset) => firstDot + offset).map((index) => <button key={index} type="button" aria-label={`Show event page ${index + 1}`} aria-current={page === index ? "page" : undefined} onClick={() => slider.current[category]?.slideTo(index)} className="flex min-h-11 min-w-7 items-center justify-center focus-visible:outline-white"><span aria-hidden="true" className={`h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none ${page === index ? "w-7 bg-brand-gradient" : "w-1.5 bg-white/45"}`} /></button>)}
              <button type="button" disabled={page === pageCount - 1} onClick={() => slider.current[category]?.slideNext()} aria-label="Next event page" className="disabled:opacity-30 ml-3 flex size-11 items-center justify-center cursor-pointer bg-primary focus-visible:outline-white"><ArrowRight aria-hidden="true" className="size-5" /></button>
            </div>
            {/* TODO: Replace with the events listing route when available. */}
            <Link href="/#contact" className="group inline-flex min-h-11 max-w-full items-center justify-center bg-white px-5 py-3 text-sm font-medium focus-visible:outline-white">
              <span className="relative inline-flex items-center pr-8">
                <span className="text-primary transition-transform duration-500 group-hover:translate-x-8 group-focus-visible:translate-x-8 motion-reduce:transition-none">VIEW ALL EVENTS</span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end text-primary transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none"><ArrowRight className="size-6" strokeWidth={1.5} /></span>
              </span>
            </Link>
          </div>
        <div className="grid min-w-0 xl:col-span-2 mt-8 md:mt-12">
        {tabs.map((tab) => <div key={tab.value} id={`events-panel-${tab.value}`} role="tabpanel" aria-labelledby={`events-tab-${tab.value}`} aria-hidden={category !== tab.value} inert={category !== tab.value} tabIndex={category === tab.value ? 0 : -1} className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-500 ease-in-out focus-visible:outline-white motion-reduce:transition-none ${category === tab.value ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
          <Swiper
            key={tab.value + pageSize}
            modules={[A11y]}
            slidesPerView={1}
            spaceBetween={32}
            speed={500}
            onSwiper={(instance) => { slider.current[tab.value] = instance; if (category === tab.value) setPage(0); }}
            onSlideChange={(instance) => { if (category === tab.value) setPage(instance.activeIndex); }}
            onBeforeTransitionStart={(instance) => {
              if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) instance.setTransition(0);
            }}
            className="w-full"
          >
            {Array.from({ length: Math.ceil(eventItems[tab.value].length / pageSize) }, (_, index) => <SwiperSlide key={index}>
              <div className="grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-14 lg:grid-cols-2">
                {eventItems[tab.value].slice(index * pageSize, (index + 1) * pageSize).map((item) => <EventCard key={item.id} item={item} />)}
              </div>
            </SwiperSlide>)}
          </Swiper>
        </div>)}
        </div>
        <p role="status" className="sr-only">{category === "upcoming" ? "Upcoming events" : "Past events"}, page {page + 1} of {pageCount}</p>
      </div>
    </section>
  );
}
