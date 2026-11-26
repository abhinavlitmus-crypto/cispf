"use client";

import { useRef, useState } from "react";
import NewsCard, { NewsComingSoonCard } from "@/components/common/NewsCard/NewsCard";
import Pagination from "@/components/common/Pagination/Pagination";
import type { NewsItem } from "@/constants/news";

// Same grid and cards as the home page section (Figma): 4 per page, no filter.
// With fewer than four publications, "Coming Soon" cards fill the rest of the row on desktop.
const pageSize = 4;
const columns = 4;

export default function NewsMediaListing({ items }: { items: NewsItem[] }) {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const pageCount = Math.ceil(items.length / pageSize);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  function changePage(nextPage: number) {
    setPage(nextPage);
    // Bring the new page into view and move focus off the pagination buttons that may disappear.
    listRef.current?.focus({ preventScroll: true });
    listRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return (
    <section aria-labelledby="news-media-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-10 pb-16 md:px-[clamp(1rem,8.6vw,10.5rem)] md:pt-[clamp(3rem,4.5vw,5.5rem)] lg:pb-[clamp(4rem,5vw,6rem)]">
        {items.length > 0 ? (
          <div ref={listRef} tabIndex={-1} className="grid scroll-mt-32 items-start gap-x-[clamp(1.5rem,2.6vw,3rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((item) => <NewsCard key={item.id} item={item} />)}
            {Array.from({ length: Math.max(columns - items.length, 0) }, (_, index) => (
              <div key={index} aria-hidden="true" className="hidden lg:block"><NewsComingSoonCard /></div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-neutral-600">News and media publications will be available soon.</p>
        )}

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} tone="light" label="News and media pages" className="mt-16 md:mt-[clamp(4rem,5vw,6rem)]" />
        <p role="status" className="sr-only">{items.length} publications{pageCount ? `, page ${page} of ${pageCount}` : ""}</p>
      </div>
    </section>
  );
}

// ─── Previous design (filter by year, 8 per page, single item centred) ─────────────────────
// To switch back: comment out everything above this line and uncomment everything below.

// "use client";

// import { useRef, useState } from "react";
// import { BsFilterLeft } from "react-icons/bs";
// import Button from "@/components/common/Button/Button";
// import NewsCard, { CenteredNewsCard } from "@/components/common/NewsCard/NewsCard";
// import Pagination from "@/components/common/Pagination/Pagination";
// import type { NewsItem } from "@/constants/news";

// const pageSize = 8;
// export default function NewsMediaListing({ items }: { items: NewsItem[] }) {
//   const [page, setPage] = useState(1);
//   const [year, setYear] = useState("");
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const panelRef = useRef<HTMLDivElement>(null);
//   const years = [...new Set(items.map((item) => item.publishedAt.slice(0, 4)).filter(Boolean))].sort().reverse();
//   const filtered = items.filter((item) => !year || item.publishedAt.startsWith(`${year}-`));
//   const pageCount = Math.ceil(filtered.length / pageSize);

//   function changePage(nextPage: number) {
//     setPage(nextPage);
//     panelRef.current?.focus({ preventScroll: true });
//     panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
//   }

//   return (
//     <section aria-labelledby="news-media-heading" className="bg-white text-black">
//       <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-0 lg:pb-[clamp(4rem,5vw,6rem)]">
//         <div className="flex items-start gap-[clamp(1.5rem,2vw,2.25rem)]">
//           <div aria-hidden="true" className="hidden flex-1 border-t border-neutral-200 md:block" />
//           <Button aria-expanded={filtersOpen} aria-controls="news-media-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="gap-4">FILTER<BsFilterLeft aria-hidden="true" className="size-6" /></Button>
//         </div>
//         {filtersOpen && (
//           <div id="news-media-filters" className="mt-6 flex flex-wrap items-center gap-4 md:justify-end">
//             <label htmlFor="news-media-year" className="text-sm font-medium">Publish year</label>
//             <select id="news-media-year" value={year} onChange={(event) => { setYear(event.target.value); setPage(1); }} className="min-h-11 border border-neutral-300 bg-white px-4 text-sm">
//               <option value="">All years</option>
//               {years.map((value) => <option key={value} value={value}>{value}</option>)}
//             </select>
//           </div>
//         )}
//         <div ref={panelRef} tabIndex={-1} className={filtered.length === 1 ? "mt-12 scroll-mt-8 lg:mt-[clamp(3rem,4vw,5rem)]" : "mt-12 grid grid-cols-1 scroll-mt-8 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-[clamp(3rem,4vw,5rem)] lg:grid-cols-4 lg:gap-x-[clamp(1.5rem,2.6vw,3rem)] lg:gap-y-14"}>
//           {filtered.length === 1 ? <CenteredNewsCard item={filtered[0]} /> : filtered.slice((page - 1) * pageSize, page * pageSize).map((item) => <NewsCard key={item.id} item={item} variant="listing" />)}
//           {!filtered.length && <p className="py-10 text-neutral-600 sm:col-span-2 lg:col-span-4">{year ? `No publications for ${year}.` : "News and media publications will be available soon."}</p>}
//         </div>
//         <Pagination page={page} pageCount={pageCount} onPageChange={changePage} tone="light" label="News and media pages" className="mt-16 md:mt-20" />
//         <p role="status" className="sr-only">{filtered.length} publications{pageCount ? `, page ${page} of ${pageCount}` : ""}</p>
//       </div>
//     </section>
//   );
// }
