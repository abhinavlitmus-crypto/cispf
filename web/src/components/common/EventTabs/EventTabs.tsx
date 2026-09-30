"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { EventTabsProps } from "@/utilities/ComponentTypes";

export const eventTabs = [
  { value: "upcoming", label: "UPCOMING EVENTS" },
  { value: "past", label: "PAST EVENTS" },
] as const;

export default function EventTabs({ value, onChange, idPrefix, className }: EventTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    onChange(eventTabs[next].value);
    tabRefs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Event category" className={cn("flex items-end justify-between gap-5 lg:justify-start lg:gap-8", className)}>
      {eventTabs.map((tab, index) => (
        <button key={tab.value} ref={(node) => { tabRefs.current[index] = node; }} id={`${idPrefix}-tab-${tab.value}`} type="button" role="tab" aria-selected={value === tab.value} aria-controls={`${idPrefix}-panel-${tab.value}`} tabIndex={value === tab.value ? 0 : -1} onClick={() => onChange(tab.value)} onKeyDown={(event) => onTabKeyDown(event, index)} className={`min-h-11 max-w-[60%] lg:max-w-none text-left font-medium transition-[color,font-size] duration-500 ease-in-out focus-visible:outline-white motion-reduce:transition-none cursor-pointer ${value === tab.value ? "text-[clamp(2rem,3vw,3.5rem)] text-white" : "text-[clamp(1.125rem,2vw,2.25rem)] text-white/55 hover:text-white"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
