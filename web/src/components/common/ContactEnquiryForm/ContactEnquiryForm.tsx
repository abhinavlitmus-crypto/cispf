"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Button from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

type ContactEnquiryFormProps = {
  className?: string;
  actionsClassName?: string;
  buttonClassName?: string;
  /** Rendered beside the send button, e.g. a link to other contact options. */
  actions?: ReactNode;
  pendingMessage?: string;
};

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

export default function ContactEnquiryForm({
  className,
  actionsClassName,
  buttonClassName,
  actions,
  pendingMessage = "Contact form submissions are coming soon.",
}: ContactEnquiryFormProps) {
  const id = useId();
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
    setStatus(pendingMessage);
  }

  const fieldClasses = (field: Field) => `${inputClasses} ${errors[field] ? "" : "border-neutral-400 focus:border-primary"}`;

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="space-y-5">
        <div>
          <label htmlFor={`${id}-name`} className="sr-only">Your company or organization name (required)</label>
          <input ref={(node) => { fieldRefs.current.name = node; }} id={`${id}-name`} name="name" type="text" autoComplete="organization" required maxLength={120} placeholder="Your Company/Organization Name *" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} className={fieldClasses("name")} />
          {errors.name && <p id={`${id}-name-error`} className="mt-2 text-sm text-primary">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="sr-only">Email (required)</label>
          <input ref={(node) => { fieldRefs.current.email = node; }} id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Email *" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} className={fieldClasses("email")} />
          {errors.email && <p id={`${id}-email-error`} className="mt-2 text-sm text-primary">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-message`} className="sr-only">Message</label>
          <textarea id={`${id}-message`} name="message" rows={4} maxLength={2000} placeholder="Message" value={values.message} onChange={handleChange} className={`${fieldClasses("message")} resize-none`} />
        </div>
      </div>
      <div className={cn("mt-16", actionsClassName)}>
        <Button type="submit" className={cn(sendButtonClasses, buttonClassName)}>SEND</Button>
        {actions}
      </div>
      <p role="status" className="mt-4 text-sm text-neutral-600 empty:hidden">{status}</p>
    </form>
  );
}
