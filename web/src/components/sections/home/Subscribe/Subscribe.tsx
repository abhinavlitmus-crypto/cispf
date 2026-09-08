"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/common/Button/Button";

const subscribeButtonClasses = [
  "relative isolate transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-100",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-primary before:opacity-0 before:content-['']",
  "before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 focus-visible:before:opacity-100 active:before:opacity-100",
  "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:before:transition-none",
].join(" ");

export default function Subscribe() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect the newsletter service before enabling subscriptions.
    setMessage("Newsletter subscriptions are coming soon. Please check back later.");
  }

  return (
    <section aria-labelledby="subscribe-heading" className="bg-white px-5 py-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,6vw,7rem)]">
      <div className="mx-auto max-w-[1380px] bg-[#f6f6f68f] px-6 py-12 text-center md:w-[80%] md:px-10 md:py-[clamp(4rem,5vw,6rem)]">
        <h2 id="subscribe-heading" className="mx-auto w-fit bg-brand-gradient bg-clip-text text-[clamp(1.5rem,2vw,2.375rem)] leading-tight font-medium text-transparent">SUBSCRIBE TO OUR NEWSLETTER</h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-500 md:text-lg">Never miss an update of our latest decisions</p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-[564px] md:mt-12">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="newsletter-name" className="sr-only">Your name</label>
              <input id="newsletter-name" name="name" type="text" autoComplete="name" maxLength={120} placeholder="Your Name" className="min-h-11 w-full min-w-0 border-0 border-b border-neutral-300 bg-transparent py-2 text-base text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label htmlFor="newsletter-email" className="sr-only">Your email (required)</label>
              <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Your Email *" className="min-h-11 w-full min-w-0 border-0 border-b border-neutral-300 bg-transparent py-2 text-base text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none" />
            </div>
          </div>
          <Button type="submit" className={`${subscribeButtonClasses} mt-10 min-w-[13.5rem] max-w-full md:mt-14`}>SUBSCRIBE</Button>
          <p role="status" className="mt-4 text-sm text-neutral-600 empty:hidden">{message}</p>
        </form>
      </div>
    </section>
  );
}
