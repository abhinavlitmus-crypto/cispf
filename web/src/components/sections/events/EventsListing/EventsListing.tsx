"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BsFilterLeft } from "react-icons/bs";
import Button from "@/components/common/Button/Button";
import EventCard from "@/components/common/EventCard/EventCard";
import EventTabs from "@/components/common/EventTabs/EventTabs";
import Pagination from "@/components/common/Pagination/Pagination";
import { emptyEventMessages, eventItems, type EventCategory } from "@/constants/events";

const pageSize = 6;

const filterButtonClasses = [
  "cursor-pointer gap-4 transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

export default function EventsListing() {
  const [category, setCategory] = useState<EventCategory>("upcoming");
  const [page, setPage] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const items = eventItems[category];
  const pageCount = Math.ceil(items.length / pageSize);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  function selectCategory(value: EventCategory) {
    if (value === category) return;
    setCategory(value);
    setPage(1);
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    // Bring the new page into view and move focus off the pagination buttons that may disappear.
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return (
    <section aria-labelledby="events-heading" className="relative isolate overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] md:h-[clamp(34rem,44vw,52rem)]">
        <Image src="/Image/home-upcoming-past-event-bg.jpg" alt="" fill fetchPriority="high" sizes="100vw" className="hidden object-cover object-top grayscale lg:block" />
        <Image src="/Image/home-upcoming-past-event-mobile.webp" alt="" fill fetchPriority="high" sizes="100vw" className="object-cover object-top grayscale lg:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.4)_55%,#000_100%)]" />
      </div>

      <div className="mx-auto max-w-[1920px] px-5 pt-20 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-[clamp(12rem,14vw,17rem)] md:pb-[clamp(4rem,7vw,8rem)]">
        <h1 id="events-heading" className="text-center text-[clamp(3rem,5vw,6rem)] leading-none font-medium">EVENTS</h1>

        <div className="mt-24 flex flex-col gap-8 md:mt-[clamp(8rem,13vw,16rem)] md:flex-row md:items-end md:justify-between">
          <EventTabs value={category} onChange={selectCategory} idPrefix="events-listing" className="md:flex-1" />
          {/* TODO: Open the event filters once the filter options are defined. */}
          <Button className={`${filterButtonClasses} self-end md:self-auto`}>FILTER<BsFilterLeft aria-hidden="true" className="size-6" /></Button>
        </div>

        <div ref={panelRef} id={`events-listing-panel-${category}`} role="tabpanel" aria-labelledby={`events-listing-tab-${category}`} tabIndex={-1} className="mt-8 grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-14 focus-visible:outline-white md:mt-12 lg:grid-cols-2 lg:gap-y-[clamp(3.5rem,5vw,6rem)]">
          {pageItems.length ? pageItems.map((item) => <EventCard key={item.id} item={item} />) : <p className="border-t border-white/20 pt-10 text-lg text-white/75 lg:col-span-2">{emptyEventMessages[category]}</p>}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} label="Event pages" className="mt-16 md:mt-[clamp(4rem,5vw,6rem)]" />
        <p role="status" className="sr-only">{category === "upcoming" ? "Upcoming events" : "Past events"}{pageCount ? `, page ${page} of ${pageCount}` : ": none available"}</p>
      </div>
    </section>
  );
}
