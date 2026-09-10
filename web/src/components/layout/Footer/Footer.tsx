import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { navigation } from "@/constants/navigation";
import { footerContact, legalLinks, socialLinks } from "@/constants/footer";
import FooterNewsletterForm from "./FooterNewsletterForm";

const socialIcons = {
  x: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const linkClasses = "underline-offset-4 hover:underline focus-visible:outline-white";

export default function Footer() {
  const heading = (
    <h2 id="footer-heading" className="text-[clamp(2rem,3.35vw,4rem)] leading-[1.28] font-medium tracking-tight">
      TOGETHER, SHAPING<br />WHAT’S NEXT.
    </h2>
  );

  const newsletter = <FooterNewsletterForm />;

  const followUs = (
    <div>
      <p className="text-sm font-medium">FOLLOW US</p>
      <ul aria-label="Social media" className="mt-1 flex flex-wrap gap-1">
        {socialLinks.map(({ label, icon, href }) => {
          const Icon = socialIcons[icon];
          const content = <span className="flex size-6 items-center justify-center rounded-full bg-white text-primary"><Icon aria-hidden="true" className="size-3.5" /></span>;
          return (
            <li key={label}>
              {href ? (
                <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center transition-transform hover:scale-110 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:scale-100">{content}</a>
              ) : (
                <span aria-label={`${label} — profile coming soon`} title={`${label} — profile coming soon`} className="flex size-9 items-center justify-center">{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  const paragraph = (
    <p className="max-w-2xl text-[clamp(1rem,1.1vw,1.25rem)] leading-relaxed font-light">
      Engage with the businesses, policymakers and institutions shaping the next phase of Canada–India relations.
    </p>
  );

  const address = (
    <address className="grid gap-6 border-y border-white/20 py-6 text-sm leading-relaxed not-italic lg:grid-cols-[1fr_1.2fr] lg:gap-x-8 lg:gap-y-8 lg:py-8">
      <div className="flex items-start gap-3">
        <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.25} />
        <p>{footerContact.address.map((line) => <span key={line} className="block">{line}</span>)}</p>
      </div>
      <a href={`mailto:${footerContact.email}`} className={`flex items-start gap-3 ${linkClasses}`}>
        <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.25} />
        <span className="break-all">{footerContact.email}</span>
      </a>
      <a href={footerContact.phoneHref} className={`flex items-center gap-3 ${linkClasses}`}>
        <Phone aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.25} />
        {footerContact.phone}
      </a>
    </address>
  );

  const logo = (
    <Link href="/" aria-label="CISPF home" className="w-fit focus-visible:outline-white">
      <Image src="/logos/logo-white.png" alt="Canada-India Strategic Partnership Forum" width={320} height={128} className="h-auto w-[190px] lg:w-[clamp(12rem,15vw,17rem)]" />
    </Link>
  );

  const nav = (
    <nav aria-label="Footer navigation" className="xl:w-[48.5%]">
      <ul className="grid grid-flow-col grid-rows-3 gap-x-10 gap-y-3 md:flex md:flex-wrap md:gap-x-6 md:gap-y-4 xl:justify-between xl:gap-x-4">
        {navigation.map(({ label, href }) => <li key={href}><Link href={href} className={`inline-flex min-h-3 md:min-h-11 items-center text-[0.7875rem] whitespace-nowrap ${linkClasses}`}>{label}</Link></li>)}
      </ul>
    </nav>
  );

  const copyright = (
    <p className="text-sm leading-relaxed">
      © {new Date().getFullYear()} CISPF. All rights reserved.{" "} <br className="block md:hidden"/>
      {legalLinks.map(({ label, href }, index) => (
        <span key={label}>
          {index > 0 && " "}
          {href ? <Link href={href} className={`underline ${linkClasses}`}>{label}</Link> : <span title="Page coming soon" className="underline underline-offset-2">{label}</span>}
        </span>
      ))}
    </p>
  );

  return (
    <footer id="contact" aria-labelledby="footer-heading" className="relative z-10 isolate bg-brand-gradient text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image src="/Icon/Leaf.svg" alt="" width={388} height={419} className="absolute top-7 left-1/2 w-[65%] max-w-[400px] -translate-x-1/2 opacity-30 brightness-0 invert md:top-[20%] md:w-[22%] md:opacity-10" />
      </div>
      <div className="mx-auto max-w-[1920px] px-5 py-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(3rem,5.4vw,6.5rem)]">
        {/* Mobile/tablet: Figma orders these blocks differently than desktop, so the two breakpoints render separate trees instead of sharing one reorderable grid. */}
        <div className="flex flex-col gap-10 md:hidden">
          {heading}
          <div className="border-b border-white/20 pb-8">{logo}</div>
          <div className="border-b border-white/20 pb-8">{nav}</div>
          {newsletter}
          {followUs}
          {paragraph}
          {address}
          {copyright}
        </div>

        <div className="hidden md:flex md:flex-col md:gap-12">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-8">
            <div>
              {heading}
              <div className="mt-8 md:mt-10">{newsletter}</div>
            </div>
            <div>
              {followUs}
              <div className="mt-6">{paragraph}</div>
              <div className="mt-8 lg:mt-[clamp(2rem,4.2vw,5rem)]">{address}</div>
            </div>
          </div>
          <div className=" grid items-end gap-8 lg:grid-cols-[minmax(0,0.25fr)_minmax(0,1fr)] lg:gap-8">
            {logo}
            <div className="flex flex-col-reverse gap-7 border-b border-white/35 pb-6 xl:flex-row xl:items-center xl:justify-between xl:gap-8 xl:pb-8">
              {copyright}
              {nav}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
