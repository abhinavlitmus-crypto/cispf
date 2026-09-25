import { LuExpand, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { contactAddress, contactMapEmbedUrl, contactMapUrl, contactPeople } from "@/constants/contact";

export default function ContactDetails() {
  return (
    <section aria-labelledby="contact-details-heading" className="bg-white text-black">
      <h2 id="contact-details-heading" className="sr-only">Contact details</h2>
      <div className="mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="grid grid-cols-1 gap-y-8 border-neutral-200 py-16 lg:grid-cols-[31.5%_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-[clamp(1.5rem,2.5vw,3rem)] lg:border-b lg:py-[clamp(4rem,4.5vw,5rem)]">
          <div className="relative aspect-581/303 w-full overflow-hidden bg-neutral-100">
            <iframe src={contactMapEmbedUrl} title={`Map showing ${contactAddress.query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 size-full border-0" />
            <a href={contactMapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open location in Google Maps (opens in a new tab)" className="absolute bottom-8 left-3 hidden size-8 items-center justify-center bg-primary text-white transition-transform duration-300 hover:scale-105 motion-reduce:transition-none lg:flex">
              <LuExpand aria-hidden="true" className="size-5" />
            </a>
          </div>

          <address className="flex gap-4 border-neutral-200 pb-8 not-italic max-lg:border-b lg:gap-6 lg:pb-0">
            <LuMapPin aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-primary lg:size-8" strokeWidth={1.5} />
            <p className="text-lg leading-relaxed font-medium lg:text-[clamp(1rem,1.1vw,1.375rem)]">
              {contactAddress.lines.map((line) => <span key={line} className="block">{line}</span>)}
            </p>
          </address>

          {contactPeople.map((person) => (
            <div key={person.name} className="pb-6 lg:pb-0">
              <h3 className="text-lg font-medium lg:text-[clamp(1rem,1.1vw,1.375rem)]">{person.name}</h3>
              <p className="mt-1 text-base text-primary lg:text-[clamp(0.9375rem,0.95vw,1.125rem)]">{person.role}</p>
              <ul className="mt-5 space-y-1 text-base lg:mt-6">
                <li>
                  <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center gap-3 hover:text-primary">
                    <LuPhone aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
                    <span><span className="sr-only">Phone: </span>{person.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${person.email}`} className="inline-flex min-h-11 items-center gap-3 break-all hover:text-primary">
                    <LuMail aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
                    <span><span className="sr-only">Email: </span>{person.email}</span>
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
