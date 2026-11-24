"use client";

import { useRef, useState } from "react";
// Filter is hidden for now (not in the Figma). Uncomment these two imports with the filter row below.
// import { BsFilterLeft } from "react-icons/bs";
// import Button from "@/components/common/Button/Button";
import Pagination from "@/components/common/Pagination/Pagination";
import PolicyCard, { PolicyComingSoonCard } from "@/components/common/PolicyCard/PolicyCard";
import type { PolicyItem } from "@/constants/policy";

const pageSize = 6;
const columns = 3;

export default function PolicyDiscussionsListing({ items }: { items: PolicyItem[] }) {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  const pageCount = Math.ceil(items.length / pageSize);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  function changePage(nextPage: number) {
    setPage(nextPage);
    // Bring the new page into view and move focus off the pagination buttons that may disappear.
    listRef.current?.focus({ preventScroll: true });
    listRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return (
    <section aria-labelledby="policy-listing-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-0 lg:pb-[clamp(4rem,6vw,7rem)]">
        <h2 id="policy-listing-heading" className="sr-only">All policy discussions</h2>

        {/* Filter row hidden for now. Uncomment it together with the imports at the top.
        <div className="flex items-start gap-[clamp(1.5rem,2vw,2.25rem)]">
          <div aria-hidden="true" className="hidden flex-1 border-t border-neutral-200 md:block" />
          TODO: Open the discussion filters once the filter options are defined.
          <Button className="cursor-pointer gap-4 transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">FILTER<BsFilterLeft aria-hidden="true" className="size-6" /></Button>
        </div>
        */}

        {/* Same grid and cards as the home page section. With fewer than three discussions,
            "Coming Soon" cards fill the rest of the first row on desktop (never more than two). */}
        {items.length > 0 && (
          <ul ref={listRef} tabIndex={-1} className="mt-12 grid grid-cols-1 scroll-mt-8 items-start gap-x-[clamp(1.25rem,1.8vw,2rem)] gap-y-12 sm:grid-cols-2 lg:mt-[clamp(3rem,3.8vw,4.5rem)] lg:grid-cols-3">
            {pageItems.map((item) => <li key={item.id} className="min-w-0"><PolicyCard item={item} variant="square" /></li>)}
            {Array.from({ length: Math.max(columns - items.length, 0) }, (_, index) => (
              <li key={`coming-soon-${index}`} aria-hidden="true" className="hidden min-w-0 lg:block"><PolicyComingSoonCard /></li>
            ))}
          </ul>
        )}
        {!items.length && <p className="mt-12 text-lg text-neutral-600">Policy discussions will be published here soon.</p>}

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} label="Policy discussion pages" tone="light" className="mt-16 md:mt-[clamp(4rem,5vw,6rem)]" />
        <p role="status" className="sr-only">Policy discussions, page {page} of {pageCount}</p>
      </div>
    </section>
  );
}
