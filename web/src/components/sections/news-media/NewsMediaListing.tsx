"use client";

import { useRef, useState } from "react";
import { BsFilterLeft } from "react-icons/bs";
import Button from "@/components/common/Button/Button";
import NewsCard from "@/components/common/NewsCard/NewsCard";
import Pagination from "@/components/common/Pagination/Pagination";
import type { NewsItem } from "@/constants/news";

const pageSize = 8;
export default function NewsMediaListing({ items }: { items: NewsItem[] }) {
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const years = [...new Set(items.map((item) => item.publishedAt.slice(0, 4)).filter(Boolean))].sort().reverse();
  const filtered = items.filter((item) => !year || item.publishedAt.startsWith(`${year}-`));
  const pageCount = Math.ceil(filtered.length / pageSize);

  function changePage(nextPage: number) {
    setPage(nextPage);
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return (
    <section aria-labelledby="news-media-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-0 lg:pb-[clamp(4rem,5vw,6rem)]">
        <div className="flex items-start gap-[clamp(1.5rem,2vw,2.25rem)]">
          <div aria-hidden="true" className="hidden flex-1 border-t border-neutral-200 md:block" />
          <Button aria-expanded={filtersOpen} aria-controls="news-media-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="gap-4">FILTER<BsFilterLeft aria-hidden="true" className="size-6" /></Button>
        </div>
        {filtersOpen && (
          <div id="news-media-filters" className="mt-6 flex flex-wrap items-center gap-4 md:justify-end">
            <label htmlFor="news-media-year" className="text-sm font-medium">Publish year</label>
            <select id="news-media-year" value={year} onChange={(event) => { setYear(event.target.value); setPage(1); }} className="min-h-11 border border-neutral-300 bg-white px-4 text-sm">
              <option value="">All years</option>
              {years.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        )}
        <div ref={panelRef} tabIndex={-1} className="mt-12 grid grid-cols-1 scroll-mt-8 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-[clamp(3rem,4vw,5rem)] lg:grid-cols-4 lg:gap-x-[clamp(1.5rem,2.6vw,3rem)] lg:gap-y-14">
          {filtered.slice((page - 1) * pageSize, page * pageSize).map((item) => <NewsCard key={item.id} item={item} variant="listing" />)}
          {!filtered.length && <p className="py-10 text-neutral-600 sm:col-span-2 lg:col-span-4">{year ? `No publications for ${year}.` : "News and media publications will be available soon."}</p>}
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} tone="light" label="News and media pages" className="mt-16 md:mt-20" />
        <p role="status" className="sr-only">{filtered.length} publications{pageCount ? `, page ${page} of ${pageCount}` : ""}</p>
      </div>
    </section>
  );
}
