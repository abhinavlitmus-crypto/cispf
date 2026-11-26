"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { connectLink, navigation, transparentHeaderRoutes } from "@/constants/navigation";

const connectButtonClasses = [
  "transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

const navigationLabelClasses = [
  "relative bg-clip-text text-black transition-colors duration-200",
  "group-hover:bg-[image:var(--gradient-brand)] group-focus-visible:bg-[image:var(--gradient-brand)] group-aria-[current=location]:bg-[image:var(--gradient-brand)] group-aria-expanded:bg-[image:var(--gradient-brand)]",
  "group-hover:text-transparent group-focus-visible:text-transparent group-aria-[current=location]:text-transparent group-aria-expanded:text-transparent",
  "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[image:var(--gradient-brand)] after:content-['']",
  "after:transition-transform after:duration-200 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 group-aria-[current=location]:after:scale-x-100 group-aria-expanded:after:scale-x-100",
  "motion-reduce:transition-none motion-reduce:after:transition-none",
].join(" ");

// Desktop-only overrides for pages whose hero sits behind the header. Mobile keeps the white header.
// The header overlays the hero and stays transparent until the page scrolls.
const overlayHeaderClasses = "md:fixed md:inset-x-0";
const transparentHeaderClasses = "md:border-transparent md:bg-transparent";
const transparentLabelClasses = "md:text-white";
// Once the page scrolls, the sticky header turns see-through white with a blur, so content shows through
// while the black links and logo stay readable over dark sections.
// const stickyHeaderClasses = "bg-white/70 backdrop-blur-md";
const stickyHeaderClasses = "bg-transparent border-transparent";

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getLocation() {
  return window.location.pathname + window.location.hash;
}

// Same-page section navigation uses the browser hash without reloading the page.
function navigateToSection(event: { preventDefault: () => void }, href: string) {
  const destination = new URL(href, window.location.href);
  if (destination.pathname === window.location.pathname && destination.hash) {
    event.preventDefault();
    window.location.hash = destination.hash;
  }
}

function getServerLocation() {
  return "";
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getScrolled = () => window.scrollY > 0;
const getServerScrolled = () => false;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileMenuHref, setMobileMenuHref] = useState<string | null>(null);
  const [menuHref, setMenuHref] = useState<string | null>(null);
  const activeHref = useSyncExternalStore(subscribeToLocation, getLocation, getServerLocation);
  const overlay = transparentHeaderRoutes.includes(usePathname());
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const transparent = overlay && !scrolled;

  const [footerVisible, setFooterVisible] = useState(false);

  // The header slides away once the footer reaches the screen. Short pages that show the footer without scrolling keep it.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
      if (entry.isIntersecting) setMenuHref(null);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header onMouseLeave={() => setMenuHref(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuHref(null); }} onKeyDown={(event) => { if (event.key === "Escape") setMenuHref(null); }} className={cn("sticky top-0 z-40 border-b border-black/5 bg-white text-foreground transition-[color,background-color,border-color,translate] duration-300 motion-reduce:transition-none", overlay && overlayHeaderClasses, transparent && transparentHeaderClasses, scrolled && stickyHeaderClasses, footerVisible && scrolled && "-translate-y-full focus-within:translate-y-0")}>
      {/* Desktop height follows the Figma at the top of the page (~130px at 1856px wide); once scrolled it
          shrinks to leave only a small gap above and below the logo (~100px). */}
      <div className={cn("mx-auto flex min-h-16 max-w-[1920px] items-center justify-between gap-4 px-5 transition-[height] duration-300 ease-out motion-reduce:transition-none md:gap-3 md:px-[clamp(1rem,2.6vw,3.125rem)]", scrolled ? "md:h-[clamp(4.5rem,5.4vw,6.25rem)]" : "md:h-[clamp(4.5rem,7vw,8.25rem)]")}>
        <Link href="/" aria-label="CISPF home" className="shrink-0">
          {/* TODO: Replace with the approved Canada-India logo. */}
          <Image src="/logos/Logo-transparent.png" alt="Canada-India Strategic Partnership Forum" width={160} height={64} preload className={cn("h-auto w-[156px] md:w-[clamp(7rem,8.6vw,12.5rem)]", transparent && "md:hidden")} />
          {/* Over the home hero video the tagline needs to be white; mobile keeps the white header and the normal logo. */}
          {transparent && <Image src="/logos/logo-description-white.png" alt="Canada-India Strategic Partnership Forum" width={336} height={166} className="hidden h-auto md:block md:w-[clamp(7rem,8.6vw,12.5rem)]" />}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-[clamp(0.75rem,3.9vw,4.5rem)] md:flex">
          <ul className="flex items-center gap-[clamp(0.75rem,3.9vw,4.5rem)]">
            {navigation.map(({ label, href, children }, index) => {
              const expanded = !!children && menuHref === href;
              return (
                <li key={href} onMouseEnter={() => setMenuHref(children ? href : null)} className="relative">
                  <Link href={href} onFocus={() => setMenuHref(children ? href : null)} onClick={() => setMenuHref(null)} aria-expanded={children ? expanded : undefined} aria-controls={children ? `header-subnavigation-${index}` : undefined} onNavigate={(event) => navigateToSection(event, href)} aria-current={activeHref === href ? "location" : undefined} className="group inline-flex min-h-11 items-center whitespace-nowrap text-[clamp(0.625rem,0.82vw,0.9375rem)] font-normal ">
                    <span className={cn(navigationLabelClasses, transparent && transparentLabelClasses)}>{label}</span>
                  </Link>
                  {/* Small dropdown under the item (Figma). It sits inside the <li>, so moving the pointer into it keeps it open;
                      the top padding bridges the gap without closing it. */}
                  {children && (
                    <div id={`header-subnavigation-${index}`} inert={!expanded} className={cn("absolute top-full left-0 pt-2 transition-[opacity,translate,visibility] duration-200 motion-reduce:transition-none", expanded ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0")}>
                      <ul aria-label={`${label} links`} className="bg-[#F0F0F0] px-[clamp(1rem,1.2vw,1.375rem)] py-[clamp(0.5rem,0.6vw,0.75rem)]">
                        {children.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} onClick={() => setMenuHref(null)} aria-current={activeHref === item.href ? "page" : undefined} className="group flex min-h-9 items-center gap-2 text-[clamp(0.625rem,0.75vw,0.875rem)] whitespace-nowrap text-black transition-colors duration-200 hover:text-primary focus-visible:text-primary motion-reduce:transition-none">
                              {item.label}
                              <ArrowRight aria-hidden="true" className="size-4 -translate-x-1 opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Button href={connectLink.href} className={cn(connectButtonClasses, "px-[clamp(0.75rem,1.35vw,1.75rem)] text-[clamp(0.6875rem,0.95vw,1.0625rem)]")}>{connectLink.label}</Button>
        </nav>

        <Sheet open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setMobileMenuHref(null); }}>
          <SheetTrigger aria-label="Open navigation menu" className="flex size-11 items-center justify-center md:hidden">
            <Menu aria-hidden="true" className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false} overlayClassName="top-17 bg-transparent backdrop-blur-none supports-backdrop-filter:backdrop-blur-none" className="isolate overflow-y-auto border-0 bg-white p-5 pt-20 shadow-none data-[side=right]:inset-y-auto data-[side=right]:top-18 data-[side=right]:bottom-0 data-[side=right]:h-[calc(100dvh-4rem)] data-[side=right]:w-full data-[side=right]:sm:max-w-none">
            <SheetClose aria-label="Close navigation menu" className="absolute top-3 left-3 flex size-11 items-center justify-center"><X aria-hidden="true" className="size-6" strokeWidth={1.25} /></SheetClose>
            <Image src="/Icon/white-leaf.svg" alt="" aria-hidden="true" width={322} height={348} className="pointer-events-none absolute right-0 bottom-0 -z-10 h-auto w-[60%] max-w-[280px]" />
            <SheetHeader className="p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">Explore the Canada-India Strategic Partnership Forum.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col">
                {navigation.map(({ label, href, children }, index) => (
                  <li key={href}>
                    {children?.length ? (
                      <>
                        <button type="button" aria-expanded={mobileMenuHref === href} aria-controls={`mobile-submenu-${index}`} onClick={() => setMobileMenuHref((current) => current === href ? null : href)} className="group flex min-h-14 w-full items-center justify-between py-4 text-left text-sm">
                          <span className={navigationLabelClasses}>{label}</span>
                          <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${mobileMenuHref === href ? "rotate-180" : ""}`} />
                        </button>
                        <div id={`mobile-submenu-${index}`} inert={mobileMenuHref !== href} className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${mobileMenuHref === href ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <ul className="border-l border-neutral-200 pl-4">
                              {children.map((child) => <li key={child.href}><Link href={child.href} onNavigate={(event) => navigateToSection(event, child.href)} onClick={() => { setOpen(false); setMobileMenuHref(null); }} className="group flex min-h-11 items-center py-3 text-xs"><span className={navigationLabelClasses}>{child.label}</span></Link></li>)}
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link href={href} onNavigate={(event) => navigateToSection(event, href)} aria-current={activeHref === href ? "location" : undefined} onClick={() => { setOpen(false); setMobileMenuHref(null); }} className="group flex min-h-14 items-center py-4 text-sm">
                        <span className={navigationLabelClasses}>{label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <Link href={connectLink.href} onClick={() => setOpen(false)} className="group flex min-h-14 items-center py-4 text-sm"><span className={navigationLabelClasses}>CONTACT US</span></Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
