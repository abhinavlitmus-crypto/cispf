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
const transparentConnectClasses = "md:bg-white md:text-black";

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
  const expandedMenu = navigation.find((item) => item.href === menuHref && item.children);
  const activeHref = useSyncExternalStore(subscribeToLocation, getLocation, getServerLocation);
  const overlay = transparentHeaderRoutes.includes(usePathname());
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const transparent = overlay && !scrolled;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header onMouseLeave={() => setMenuHref(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuHref(null); }} onKeyDown={(event) => { if (event.key === "Escape") setMenuHref(null); }} className={cn("sticky top-0 z-40 border-b border-black/5 bg-white text-foreground transition-colors duration-300 motion-reduce:transition-none", overlay && overlayHeaderClasses, transparent && transparentHeaderClasses)}>
      <div className="mx-auto flex min-h-16 max-w-[1920px] items-center justify-between gap-4 px-5 md:min-h-18 md:gap-3 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <Link href="/" aria-label="CISPF home" className="shrink-0">
          {/* TODO: Replace with the approved Canada-India logo. */}
          <Image src="/logos/Logo-transparent.png" alt="Canada-India Strategic Partnership Forum" width={160} height={64} priority className="h-auto w-[156px] md:w-[clamp(7rem,11.5vw,17rem)]" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-[clamp(0.75rem,3vw,3.75rem)] md:flex">
          <ul className="flex items-center gap-[clamp(0.75rem,3vw,3.75rem)]">
            {navigation.map(({ label, href, children }) => (
              <li key={href} onMouseEnter={() => setMenuHref(children ? href : null)}>
                <Link href={href} onFocus={() => setMenuHref(children ? href : null)} onClick={() => setMenuHref(null)} aria-expanded={children ? menuHref === href : undefined} aria-controls={children ? "header-subnavigation" : undefined} onNavigate={(event) => navigateToSection(event, href)} aria-current={activeHref === href ? "location" : undefined} className="group inline-flex min-h-11 items-center whitespace-nowrap text-[clamp(0.625rem,0.75vw,0.875rem)] font-normal ">
                  <span className={cn(navigationLabelClasses, transparent && transparentLabelClasses)}>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Button href={connectLink.href} className={cn(connectButtonClasses, "px-[clamp(0.75rem,1.35vw,1.75rem)] text-[clamp(0.6875rem,0.95vw,1.0625rem)]", transparent && transparentConnectClasses)}>{connectLink.label}</Button>
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
      <div id="header-subnavigation" inert={!expandedMenu} className={`absolute inset-x-0 top-full hidden border-x-2 border-primary bg-[#F6F6F6] transition-[opacity,translate,visibility] duration-200 md:block motion-reduce:transition-none ${expandedMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        {expandedMenu && <div className="mx-auto grid max-w-[1920px] grid-cols-[1fr_3fr] items-center gap-10 px-[clamp(2rem,8vw,10rem)] py-[clamp(2rem,3.5vw,4rem)]">
          <p className="border-r border-neutral-200 py-6 pr-8 text-[clamp(1.25rem,2vw,2.5rem)] font-medium"><span className="bg-brand-gradient bg-clip-text text-transparent">{expandedMenu.label}</span></p>
          <nav aria-label={`${expandedMenu.label} links`}><ul className="flex flex-wrap justify-around gap-6">
            {expandedMenu.children?.map((item) => <li key={item.href}><Link href={item.href} onClick={() => setMenuHref(null)} className="group flex min-h-11 items-center gap-2 text-xs hover:text-primary focus-visible:text-primary lg:text-sm">{item.label}<ArrowRight aria-hidden="true" className="size-4 -translate-x-1 opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none" /></Link></li>)}
          </ul></nav>
        </div>}
      </div>
    </header>
  );
}
