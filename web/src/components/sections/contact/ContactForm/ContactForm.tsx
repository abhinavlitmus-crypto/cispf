import Image from "next/image";
import ContactEnquiryForm from "@/components/common/ContactEnquiryForm/ContactEnquiryForm";

export default function ContactForm() {
  return (
    <section aria-labelledby="contact-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="grid grid-cols-1 border-neutral-200 pt-14 lg:grid-cols-[minmax(0,1fr)_52%] lg:gap-[clamp(2rem,4vw,5rem)] lg:border-b lg:pt-[clamp(1.5rem,1.6vw,2rem)] lg:pb-[clamp(4rem,5.5vw,6.5rem)]">
          <div className="px-5 pb-20 md:px-0 lg:pb-0">
            <h1 id="contact-heading" className="gradient-text text-center text-[clamp(2.25rem,3.9vw,4.5rem)] leading-tight font-semibold lg:mt-[clamp(2rem,3.5vw,4rem)] lg:text-left">CONTACT US</h1>
            <ContactEnquiryForm className="mt-12 max-w-[546px] lg:mt-[clamp(4rem,7vw,8.5rem)]" buttonClassName="w-full lg:w-auto" pendingMessage="Contact form submissions are coming soon. Please reach us using the details below." />
          </div>

          <div className="relative aspect-786/1006 w-full self-start overflow-hidden lg:aspect-1980/1384">
            <Image src="/Image/contact-us-image-desktop.png" alt="Business leaders in discussion around a meeting table" fill sizes="52vw" className="hidden object-cover lg:block" />
            <Image src="/Image/contact-us-image-mobile.png" alt="Business leaders in discussion around a meeting table" fill sizes="100vw" className="object-cover lg:hidden" />
            <Image src="/Image/contact-us-image-gradient.png" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 52vw, 100vw" className="pointer-events-none object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
