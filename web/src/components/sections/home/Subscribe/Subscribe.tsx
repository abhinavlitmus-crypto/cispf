"use client";

import { useRef, useState, type FormEvent } from "react";
import Button from "@/components/common/Button/Button";
import { subscribeToNewsletter } from "@/api/newsletter";

const subscribeButtonClasses = [
  "transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

export default function Subscribe() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    submitting.current = true;
    setLoading(true);
    setFailed(false);
    setMessage("");
    try {
      const response = await subscribeToNewsletter({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        consent: data.get("consent") === "on",
      });
      setMessage(response.data.message);
      form.reset();
    } catch (error) {
      const body = error as { success?: boolean; message?: string; errors?: { msg?: string }[] } | null;
      setFailed(true);
      setMessage(body?.errors?.[0]?.msg || (body?.success === false && body.message) || "Something went wrong. Please check your connection and try again.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="subscribe-heading" className="bg-white px-5 py-12 md:px-[clamp(1rem,2.6vw,3.125rem)] md:py-[clamp(4rem,6vw,7rem)]">
      <div className="mx-auto max-w-[1380px] bg-[#f6f6f68f] px-6 py-12 text-center md:w-[80%] md:px-10 md:py-[clamp(4rem,5vw,6rem)]">
        <h2 id="subscribe-heading" className="mx-auto w-fit bg-brand-gradient bg-clip-text text-[clamp(1.75rem,2.4vw,2.75rem)] leading-tight font-medium text-transparent">SUBSCRIBE TO OUR NEWSLETTER</h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-500 md:text-lg">Never miss an update of our latest decisions</p>
        <form onSubmit={handleSubmit} aria-busy={loading} className="mx-auto mt-8 max-w-[564px] md:mt-12">
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
          <div className="mt-6 flex items-start gap-2 text-left">
            <input id="homepage-newsletter-consent" name="consent" type="checkbox" required aria-describedby="homepage-newsletter-message" className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary" />
            <label htmlFor="homepage-newsletter-consent" className="cursor-pointer text-xs leading-relaxed text-neutral-600">I agree to receive the CISPF newsletter and can unsubscribe at any time.</label>
          </div>
          <Button type="submit" disabled={loading} className={`${subscribeButtonClasses} mt-10 min-w-[13.5rem] max-w-full md:mt-14`}>{loading ? "SUBSCRIBING…" : "SUBSCRIBE"}</Button>
          <p id="homepage-newsletter-message" role={failed ? "alert" : "status"} className="mt-4 text-sm text-neutral-600 empty:hidden">{message}</p>
        </form>
      </div>
    </section>
  );
}
