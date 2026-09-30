"use client";

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { cn } from "@/lib/utils";
import type { PaginationProps } from "@/utilities/ComponentTypes";

// Keeps the first and last page visible and collapses the rest around the current page.
function getPageItems(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 6) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, 4, "gap", pageCount];
  if (page >= pageCount - 2) return [1, "gap", pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "gap", page - 1, page, page + 1, "gap", pageCount];
}

const arrowClasses = "flex size-11 cursor-pointer items-center justify-center bg-primary text-white transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100";

const toneClasses = {
  dark: { focus: "focus-visible:outline-white", muted: "text-white/75", page: "text-white/75 hover:text-white" },
  light: { focus: "", muted: "text-neutral-400", page: "text-neutral-400 hover:text-black" },
};

export default function Pagination({ page, pageCount, onPageChange, label = "Pagination", className, tone = "dark" }: PaginationProps) {
  if (pageCount <= 1) return null;
  const colors = toneClasses[tone];

  return (
    <nav aria-label={label} className={cn("flex items-center justify-center gap-4", className)}>
      {page > 1 && <button type="button" onClick={() => onPageChange(page - 1)} aria-label="Previous page" className={cn(arrowClasses, colors.focus)}><BsArrowLeft aria-hidden="true" className="size-5" /></button>}
      <ul className="flex items-center gap-1 text-lg">
        {getPageItems(page, pageCount).map((item, index) => (
          <li key={item === "gap" ? `gap-${index}` : item}>
            {item === "gap" ? (
              <span aria-hidden="true" className={cn("px-1", colors.muted)}>.....</span>
            ) : (
              <button type="button" onClick={() => onPageChange(item)} aria-label={`Page ${item}`} aria-current={item === page ? "page" : undefined} className={cn("flex min-h-11 min-w-6 cursor-pointer items-center justify-center transition-colors", colors.focus, item === page ? "text-primary" : colors.page)}>{item}</button>
            )}
          </li>
        ))}
      </ul>
      {page < pageCount && <button type="button" onClick={() => onPageChange(page + 1)} aria-label="Next page" className={cn(arrowClasses, colors.focus)}><BsArrowRight aria-hidden="true" className="size-5" /></button>}
    </nav>
  );
}
