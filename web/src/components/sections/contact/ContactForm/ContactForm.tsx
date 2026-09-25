"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Button from "@/components/common/Button/Button";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const namePattern = /^[\p{L}\s]+$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const sendButtonClasses = [
  "transition-transform duration-300 ease-in-out hover:scale-105",
  "motion-reduce:transition-none motion-reduce:hover:scale-100",
].join(" ");

const inputClasses = "w-full min-w-0 border-0 border-b bg-transparent py-3 text-base text-black placeholder:text-neutral-500 focus:outline-none aria-invalid:border-primary";

function validate({ name, email }: Values): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Please enter your company or organization name.";
  else if (!namePattern.test(name.trim())) errors.name = "Name can only contain letters and spaces.";
  if (!email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(email.trim())) errors.email = "Please enter a valid email address.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const next = { ...values, [name]: name === "name" ? value.replace(/[^\p{L}\s]/gu, "") : value };
    setValues(next);
    setStatus("");
    // Errors refresh live only after the first submit attempt.
    if (submitted) setErrors(validate(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setSubmitted(true);
    setErrors(nextErrors);
    const firstInvalid = (["name", "email"] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }
    // TODO: Connect the contact form service before enabling submissions.
    setStatus("Contact form submissions are coming soon. Please reach us using the details below.");
  }

  const fieldClasses = (field: Field) => `${inputClasses} ${errors[field] ? "" : "border-neutral-400 focus:border-primary"}`;

  return (
    <section aria-labelledby="contact-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] md:px-[clamp(1rem,2.6vw,3.125rem)]">
        <div className="grid grid-cols-1 border-neutral-200 pt-14 lg:grid-cols-[minmax(0,1fr)_52%] lg:gap-[clamp(2rem,4vw,5rem)] lg:border-b lg:pt-[clamp(1.5rem,1.6vw,2rem)] lg:pb-[clamp(4rem,5.5vw,6.5rem)]">
          <div className="px-5 pb-20 md:px-0 lg:pb-0">
            <h1 id="contact-heading" className="gradient-text text-center text-[clamp(2.25rem,3.9vw,4.5rem)] leading-tight font-semibold lg:mt-[clamp(2rem,3.5vw,4rem)] lg:text-left">CONTACT US</h1>
            <form onSubmit={handleSubmit} noValidate className="mt-12 max-w-[546px] lg:mt-[clamp(4rem,7vw,8.5rem)]">
              <div className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your company or organization name (required)</label>
                  <input ref={(node) => { fieldRefs.current.name = node; }} id="contact-name" name="name" type="text" autoComplete="organization" required maxLength={120} placeholder="Your Company/Organization Name *" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} className={fieldClasses("name")} />
                  {errors.name && <p id="contact-name-error" className="mt-2 text-sm text-primary">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email (required)</label>
                  <input ref={(node) => { fieldRefs.current.email = node; }} id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Email *" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} className={fieldClasses("email")} />
                  {errors.email && <p id="contact-email-error" className="mt-2 text-sm text-primary">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea id="contact-message" name="message" rows={4} maxLength={2000} placeholder="Message" value={values.message} onChange={handleChange} className={`${fieldClasses("message")} resize-none`} />
                </div>
              </div>
              <Button type="submit" className={`${sendButtonClasses} mt-16 w-full lg:w-auto`}>SEND</Button>
              <p role="status" className="mt-4 text-sm text-neutral-600 empty:hidden">{status}</p>
            </form>
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
