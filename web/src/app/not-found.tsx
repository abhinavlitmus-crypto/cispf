import Button from "@/components/common/Button/Button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[65svh] flex-1 items-center justify-center bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="gradient-text text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.1] font-medium uppercase">Page coming soon</h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-neutral-500 md:text-lg">We’re working on this page. Please check back soon.</p>
        <Button href="/" className="mt-9">
          <ArrowLeft aria-hidden="true" className="size-5" />
          BACK TO HOME
        </Button>
      </div>
    </main>
  );
}
