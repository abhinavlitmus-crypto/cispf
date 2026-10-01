"use client";

import { useRef, useState } from "react";
import { BsFilterLeft } from "react-icons/bs";
import Button from "@/components/common/Button/Button";
import Pagination from "@/components/common/Pagination/Pagination";
import PolicyCard from "@/components/common/PolicyCard/PolicyCard";
import { policyDiscussionItems } from "@/constants/policy";

const pageSize = 6;

export default function PolicyDiscussionsListing() {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  const pageCount = Math.ceil(policyDiscussionItems.length / pageSize);
  const pageItems = policyDiscussionItems.slice((page - 1) * pageSize, page * pageSize);

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

        <div className="flex items-start gap-[clamp(1.5rem,2vw,2.25rem)]">
          <div aria-hidden="true" className="hidden flex-1 border-t border-neutral-200 md:block" />
          {/* TODO: Open the discussion filters once the filter options are defined. */}
          <Button className="cursor-pointer gap-4 transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">FILTER<BsFilterLeft aria-hidden="true" className="size-6" /></Button>
        </div>

        <ul ref={listRef} tabIndex={-1} className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-[clamp(3rem,3.8vw,4.5rem)] lg:grid-cols-3 lg:gap-0">
          {/* Desktop cells are split by a left rule between columns and a top rule from the second row on. */}
          <PolicyCard item={policyDiscussionItems[0]} variant="listing" />
          {/* {pageItems.map((item) => <li key={item.id} className="min-w-0 border-neutral-200 lg:px-[clamp(1.5rem,3vw,3.5rem)] lg:py-[clamp(2rem,3vw,3.5rem)] lg:nth-[3n+1]:pl-0 lg:nth-[3n]:pr-0 lg:nth-[-n+3]:pt-0 lg:not-nth-[3n+1]:border-l lg:nth-[n+4]:border-t"><PolicyCard item={item} variant="listing" /></li>)} */}
        </ul>

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} label="Policy discussion pages" tone="light" className="mt-16 md:mt-[clamp(4rem,5vw,6rem)]" />
        <p role="status" className="sr-only">Policy discussions, page {page} of {pageCount}</p>
      </div>
    </section>
  );
}
