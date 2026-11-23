"use client";

import Image from "next/image";
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
      {/* Form panel on the left, photo with the leaf on the right; stacked on smaller screens. */}
      <div className="mx-auto grid max-w-[1352px] lg:w-[85%] lg:grid-cols-[53fr_47fr] xl:w-[73%]">
      <div className="bg-[#f3f3f3] px-6 py-12 md:px-[clamp(2.5rem,6vw,5rem)] md:py-[clamp(3rem,5vw,6rem)]">
        {/* max-w in em breaks the heading after "OUR", as in the design. */}
        <h2 id="subscribe-heading" className="max-w-[13em] text-[clamp(1.75rem,2.2vw,2.5rem)] leading-tight font-medium text-black">SUBSCRIBE TO OUR NEWSLETTER</h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">Never miss an update of our latest decisions</p>
        <form onSubmit={handleSubmit} aria-busy={loading} className="mt-8 max-w-[564px] md:mt-12">
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
          <div className="mt-6 flex items-start gap-2">
            <input id="homepage-newsletter-consent" name="consent" type="checkbox" required aria-describedby="homepage-newsletter-message" className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary" />
            <label htmlFor="homepage-newsletter-consent" className="cursor-pointer text-xs leading-relaxed text-neutral-600">I agree to receive the CISPF newsletter and can unsubscribe at any time.</label>
          </div>
          <Button type="submit" disabled={loading} className={`${subscribeButtonClasses} mt-8 min-w-[13.5rem] max-w-full md:mt-10`}>{loading ? "SUBSCRIBING…" : "SUBSCRIBE"}</Button>
          <p id="homepage-newsletter-message" role={failed ? "alert" : "status"} className="mt-4 text-sm text-neutral-600 empty:hidden">{message}</p>
        </form>
      </div>
      {/* The photo already carries the red gradient; only the faint leaf goes on top. */}
      <div aria-hidden="true" className="relative flex aspect-1306/1074 items-center justify-center overflow-hidden lg:aspect-auto">
        <Image src="/Image/subscribe-to-newselleter-image.webp" alt="" fill sizes="(min-width: 1920px) 640px, (min-width: 1024px) 40vw, 100vw" className="object-cover" />
        <Image src="/Icon/leaf-subscribe.svg" alt="" width={322} height={348} className="pointer-events-none relative h-auto w-[35%] max-w-[200px]" />
      </div>
      </div>
    </section>
  );
}
