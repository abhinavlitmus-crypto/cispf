import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/utilities/ComponentTypes";

export default function Button({ variant = "solid", className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50",
    variant === "solid" ? "bg-primary text-white" : "border border-primary text-primary",
    className,
  );

  if (typeof props.href === "string") {
    return <Link {...props} className={classes}>{children}</Link>;
  }

  return <button type="button" {...props} className={classes}>{children}</button>;
}
