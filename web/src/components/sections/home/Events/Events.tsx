"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import EventCard from "@/components/common/EventCard/EventCard";
import EventTabs, { eventTabs } from "@/components/common/EventTabs/EventTabs";
import { emptyEventMessages, getDefaultEventCategory, type EventCategory, type EventGroups } from "@/constants/events";

// The home page shows the first two events of each tab; the full list is on /events.
const visibleEvents = 2;

export default function Events({ events }: { events: EventGroups }) {
  const [category, setCategory] = useState<EventCategory>(() => getDefaultEventCategory(events));

  return (
    <section id="events" aria-label="Events" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 py-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,5vw,6rem)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <EventTabs value={category} onChange={setCategory} idPrefix="events" tone="light" pastFirst />
          <Button href="/events" className="group max-w-full shrink-0 self-start px-4 text-xs sm:px-6 sm:text-sm lg:self-auto">
            <span className="relative inline-flex items-center pr-10">
              <span className="transition-transform duration-500 group-hover:translate-x-10 group-focus-visible:translate-x-10 motion-reduce:transition-none">VIEW ALL EVENTS</span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end transition-transform duration-500 group-hover:translate-x-[calc(-100%+1.5rem)] group-focus-visible:translate-x-[calc(-100%+1.5rem)] motion-reduce:transition-none"><ArrowRight className="size-6 shrink-0" strokeWidth={1.5} /></span>
            </span>
          </Button>
        </div>
        {/* Both panels share one grid cell so switching tabs cross-fades without a height jump. */}
        <div className="mt-10 grid md:mt-[clamp(3rem,4.5vw,5.5rem)]">
          {eventTabs.map((tab) => (
            <div key={tab.value} id={`events-panel-${tab.value}`} role="tabpanel" aria-labelledby={`events-tab-${tab.value}`} aria-hidden={category !== tab.value} inert={category !== tab.value} tabIndex={category === tab.value ? 0 : -1} className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${category === tab.value ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
              {events[tab.value].length === 0 ? (
                <p className="border-t border-neutral-200 pt-10 text-lg text-neutral-600">{emptyEventMessages[tab.value]}</p>
              ) : (
                <div className="grid items-start gap-x-[clamp(2rem,3.2vw,4rem)] gap-y-14 lg:grid-cols-2">
                  {events[tab.value].slice(0, visibleEvents).map((item) => <EventCard key={item.id} item={item} tone="light" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
