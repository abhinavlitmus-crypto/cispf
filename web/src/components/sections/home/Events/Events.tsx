"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/common/EventCard/EventCard";
import { eventItems, type EventCategory } from "@/constants/events";

const tabs = [
  { value: "upcoming", label: "UPCOMING EVENTS" },
  { value: "past", label: "PAST EVENTS" },
] as const;
const pageSize = 4;

export default function Events() {
  const [category, setCategory] = useState<EventCategory>("upcoming");
  const [page, setPage] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = eventItems[category];
  const pageCount = Math.ceil(items.length / pageSize);

  function selectTab(value: EventCategory) {
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] md:h-[clamp(28rem,36vw,43rem)]">
        <Image src="/Image/home-upcoming-past-event-bg.png" alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_45%,#000_100%)]" />
      </div>
      <div className="mx-auto max-w-[1920px] px-5 pt-28 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(10rem,19vw,23rem)] md:pb-[clamp(4rem,7vw,8rem)]">
        <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          <div role="tablist" aria-label="Event category" className="flex flex-wrap items-center gap-x-5 gap-y-2 md:gap-x-8">
            {tabs.map((tab, index) => (
              <button key={tab.value} ref={(node) => { tabRefs.current[index] = node; }} id={`events-tab-${tab.value}`} type="button" role="tab" aria-selected={category === tab.value} aria-controls={`events-panel-${tab.value}`} tabIndex={category === tab.value ? 0 : -1} onClick={() => selectTab(tab.value)} onKeyDown={(event) => onTabKeyDown(event, index)} className={`min-h-11 text-left font-medium transition-colors duration-300 focus-visible:outline-white motion-reduce:transition-none ${category === tab.value ? "text-[clamp(1.5rem,3vw,3.5rem)] text-white" : "text-[clamp(1.125rem,2vw,2.25rem)] text-white/55 hover:text-white"}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div role="group" aria-label="Event pages" className="flex items-center">
              {Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" aria-label={`Show event page ${index + 1}`} aria-current={page === index ? "page" : undefined} onClick={() => setPage(index)} className="flex min-h-11 min-w-7 items-center justify-center focus-visible:outline-white"><span aria-hidden="true" className={`h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none ${page === index ? "w-7 bg-brand-gradient" : "w-1.5 bg-white/45"}`} /></button>)}
              <button type="button" onClick={() => setPage((current) => (current + 1) % pageCount)} aria-label="Next event page" className="ml-3 flex size-11 items-center justify-center bg-brand-gradient focus-visible:outline-white"><ArrowRight aria-hidden="true" className="size-5" /></button>
            </div>
            {/* TODO: Replace with the events listing route when available. */}
            <Link href="/#contact" className="group inline-flex min-h-11 max-w-full items-center justify-center bg-white px-5 py-3 text-xs font-medium focus-visible:outline-white">
              <span className="relative inline-flex items-center pr-8">
                <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent transition-transform duration-500 group-hover:translate-x-8 group-hover:bg-none group-hover:text-primary group-focus-visible:translate-x-8 group-focus-visible:bg-none group-focus-visible:text-primary motion-reduce:transition-none">VIEW ALL EVENTS</span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end text-secondary transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-hover:text-primary group-focus-visible:translate-x-[calc(-100%+1.5rem)] group-focus-visible:text-primary motion-reduce:transition-none"><ArrowRight className="size-6" strokeWidth={1.5} /></span>
              </span>
            </Link>
          </div>
        </div>
        {tabs.map((tab) => <div key={tab.value} id={`events-panel-${tab.value}`} role="tabpanel" aria-labelledby={`events-tab-${tab.value}`} hidden={category !== tab.value} tabIndex={0} className="mt-8 focus-visible:outline-white md:mt-12">
          {category === tab.value && <div className="grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 lg:grid-cols-2 md:gap-y-14">
            {items.slice(page * pageSize, (page + 1) * pageSize).map((item) => <EventCard key={item.id} item={item} />)}
          </div>}
        </div>)}
        <p role="status" className="sr-only">{category === "upcoming" ? "Upcoming events" : "Past events"}, page {page + 1} of {pageCount}</p>
      </div>
    </section>
  );
}
