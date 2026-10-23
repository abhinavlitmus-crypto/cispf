import Button from "@/components/common/Button/Button";
import GoBackButton from "@/components/common/GoBackButton/GoBackButton";

// Placeholder for routes that are linked but not built yet; styled to match the 404 page.
export default function ComingSoon({ title = "Coming soon" }: { title?: string }) {
  return (
    <main className="relative isolate z-10 flex min-h-[75svh] flex-1 items-center justify-center overflow-hidden bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="gradient-text text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.1] font-medium uppercase">{title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-600 md:text-xl">We’re working on this page. Please check back soon.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 md:mt-14">
          <GoBackButton className="min-w-44 cursor-pointer bg-white md:text-base" />
          <Button href="/" className="min-w-44 md:text-base">GO TO HOME</Button>
        </div>
      </div>
    </main>
  );
}
