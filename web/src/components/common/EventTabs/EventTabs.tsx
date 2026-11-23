"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { EventTabsProps } from "@/utilities/ComponentTypes";

export const eventTabs = [
  { value: "upcoming", label: "UPCOMING EVENTS" },
  { value: "past", label: "PAST EVENTS" },
] as const;

const toneClasses = {
  dark: { focus: "focus-visible:outline-white", active: "text-white", inactive: "text-white/55 hover:text-white" },
  light: { focus: "", active: "text-primary", inactive: "text-neutral-500 hover:text-black" },
};

export default function EventTabs({ value, onChange, idPrefix, className, tone = "dark", pastFirst = false }: EventTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = pastFirst ? [...eventTabs].reverse() : eventTabs;
  const colors = toneClasses[tone];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    onChange(tabs[next].value);
    tabRefs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Event category" className={cn("flex items-end justify-between gap-5 lg:justify-start lg:gap-8", className)}>
      {tabs.map((tab, index) => (
        <button key={tab.value} ref={(node) => { tabRefs.current[index] = node; }} id={`${idPrefix}-tab-${tab.value}`} type="button" role="tab" aria-selected={value === tab.value} aria-controls={`${idPrefix}-panel-${tab.value}`} tabIndex={value === tab.value ? 0 : -1} onClick={() => onChange(tab.value)} onKeyDown={(event) => onTabKeyDown(event, index)} className={`min-h-11 max-w-[60%] lg:max-w-none text-left font-medium transition-[color,font-size] duration-500 ease-in-out ${colors.focus} motion-reduce:transition-none cursor-pointer ${value === tab.value ? `text-[clamp(2rem,3vw,3.5rem)] ${colors.active}` : `text-[clamp(1.125rem,2vw,2.25rem)] ${colors.inactive}`}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
