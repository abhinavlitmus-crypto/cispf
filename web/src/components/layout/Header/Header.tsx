"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { connectLink, navigation } from "@/constants/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white text-foreground">
      <div className="mx-auto flex min-h-16 max-w-[1920px] items-center justify-between gap-4 px-5 md:min-h-18 md:gap-3 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <Link href="/" aria-label="CISPF home" className="shrink-0">
          {/* TODO: Replace with the approved Canada-India logo. */}
          <Image src="/logos/canada-india-placeholder.svg" alt="Canada-India Strategic Partnership Forum" width={160} height={64} priority className="h-auto w-[116px] md:w-[clamp(6rem,7.5vw,8rem)]" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-[clamp(0.75rem,3vw,3.75rem)] md:flex">
          <ul className="flex items-center gap-[clamp(0.75rem,3vw,3.75rem)]">
            {navigation.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center whitespace-nowrap text-[clamp(0.625rem,0.75vw,0.875rem)] font-normal hover:underline underline-offset-4">{label}</Link>
              </li>
            ))}
          </ul>
          <Button href={connectLink.href} className="px-[clamp(0.75rem,1.35vw,1.75rem)] text-[clamp(0.6875rem,0.95vw,1.0625rem)]">{connectLink.label}</Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Open navigation menu" className="flex size-11 items-center justify-center md:hidden">
            <Menu aria-hidden="true" className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="overflow-y-auto p-6 pt-16 data-[side=right]:w-[min(90vw,24rem)] [&_[data-slot=sheet-close]]:size-11">
            <SheetHeader className="p-0">
              <SheetTitle>CANADA·INDIA</SheetTitle>
              <SheetDescription className="sr-only">Explore the Canada-India Strategic Partnership Forum.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col divide-y divide-border">
                {navigation.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} className="flex min-h-14 items-center py-4 text-sm hover:underline underline-offset-4">{label}</Link>
                  </li>
                ))}
              </ul>
              <Button href={connectLink.href} onClick={() => setOpen(false)} className="mt-6 w-full">{connectLink.label}</Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
