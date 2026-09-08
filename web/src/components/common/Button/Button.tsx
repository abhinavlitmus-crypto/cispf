import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = (
  | (ComponentProps<typeof Link> & { href: string })
  | (ComponentProps<"button"> & { href?: never })
) & { variant?: "solid" | "outline" };

export default function Button({ variant = "solid", className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50",
    variant === "solid" ? "bg-brand-gradient text-white" : "border border-transparent [border-image:var(--gradient-brand)_1]",
    className,
  );
  const content = variant === "outline" ? (
    <span className="inline-flex items-center gap-2 bg-brand-gradient bg-clip-text text-transparent">{children}</span>
  ) : children;

  if (typeof props.href === "string") {
    return <Link {...props} className={classes}>{content}</Link>;
  }

  return <button type="button" {...props} className={classes}>{content}</button>;
}
