"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { LoaderCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/api/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fallbackError = "Something went wrong. Please check your connection and try again.";

// The API rejects with its response body: { message, success: false } or, for validation, { errors: [{ msg }] }.
function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const body = error as { success?: boolean; message?: string; errors?: { msg?: string }[] };
    if (body.errors?.[0]?.msg) return body.errors[0].msg;
    if (body.success === false && body.message) return body.message;
  }
  return fallbackError;
}

export default function FooterNewsletterForm() {
  // The footer renders this form twice (mobile and desktop), so ids must be unique per instance.
  const id = useId();
  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [invalidField, setInvalidField] = useState<"email" | "consent" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const consent = data.get("consent") === "on";

    if (!emailPattern.test(email)) {
      setInvalidField("email");
      setResult({ type: "error", message: email ? "Please enter a valid email address." : "Please enter your email address." });
      return;
    }
    if (!consent) {
      setInvalidField("consent");
      setResult({ type: "error", message: "Please confirm that you would like to receive the CISPF newsletter." });
      return;
    }

    submitting.current = true;
    setLoading(true);
    setInvalidField(null);
    setResult(null);
    try {
      const response = await subscribeToNewsletter({ name, email, consent });
      setResult({ type: "success", message: response.data.message });
      form.reset();
    } catch (error) {
      // Values stay in the form so the visitor can retry.
      setResult({ type: "error", message: getErrorMessage(error) });
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-medium">SUBSCRIBE TO OUR NEWSLETTER</p>
      <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="mt-3 max-w-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-3">
          <div>
            <label htmlFor={`${id}-name`} className="sr-only">Your name</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={120} placeholder="Your Name" className="min-h-11 w-full min-w-0 border-0 border-b border-white/40 bg-transparent py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none" />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="sr-only">Your email (required)</label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Your Email *" aria-invalid={invalidField === "email"} aria-describedby={`${id}-message`} onChange={() => invalidField === "email" && setInvalidField(null)} className="min-h-11 w-full min-w-0 border-0 border-b border-white/40 bg-transparent py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none aria-invalid:border-white" />
          </div>
          <button type="submit" disabled={loading} aria-label={loading ? "Subscribing" : "Subscribe"} className="group flex size-11 shrink-0 cursor-pointer items-center justify-center bg-white text-primary focus-visible:outline-white disabled:cursor-wait disabled:opacity-80">
            {loading ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <BsArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none" />
            )}
          </button>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <input id={`${id}-consent`} name="consent" type="checkbox" required aria-invalid={invalidField === "consent"} aria-describedby={`${id}-message`} onChange={() => invalidField === "consent" && setInvalidField(null)} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-white" />
          <label htmlFor={`${id}-consent`} className="cursor-pointer text-xs leading-relaxed text-white/80">I agree to receive the CISPF newsletter and can unsubscribe at any time.</label>
        </div>
        <p id={`${id}-message`} role={result?.type === "error" ? "alert" : "status"} className="mt-3 text-xs font-medium text-white empty:hidden">
          {loading ? "Subscribing…" : result?.message}
        </p>
      </form>
    </div>
  );
}
