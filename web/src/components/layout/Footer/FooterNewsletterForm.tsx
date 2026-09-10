"use client";

import { useState, type FormEvent } from "react";
import { BsArrowUpRight } from "react-icons/bs";

export default function FooterNewsletterForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect the newsletter service before enabling subscriptions.
    setMessage("Newsletter subscriptions are coming soon. Please check back later.");
  }

  return (
    <div>
      <p className="text-xs font-medium">SUBSCRIBE TO OUR NEWSLETTER</p>
      <form onSubmit={handleSubmit} className="mt-3 max-w-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-3">
          <div>
            <label htmlFor="footer-newsletter-name" className="sr-only">Your name</label>
            <input id="footer-newsletter-name" name="name" type="text" autoComplete="name" maxLength={120} placeholder="Your Name" className="min-h-11 w-full min-w-0 border-0 border-b border-white/40 bg-transparent py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none" />
          </div>
          <div>
            <label htmlFor="footer-newsletter-email" className="sr-only">Your email (required)</label>
            <input id="footer-newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Your Email *" className="min-h-11 w-full min-w-0 border-0 border-b border-white/40 bg-transparent py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none" />
          </div>
          <button type="submit" aria-label="Subscribe" className="group flex size-11 shrink-0 items-center justify-center bg-white text-primary focus-visible:outline-white">
            <BsArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none" />
          </button>
        </div>
        <p role="status" className="mt-3 text-xs text-white/80 empty:hidden">{message}</p>
      </form>
    </div>
  );
}
