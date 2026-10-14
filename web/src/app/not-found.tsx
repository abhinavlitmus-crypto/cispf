import Button from "@/components/common/Button/Button";
import GoBackButton from "@/components/common/GoBackButton/GoBackButton";

export default function NotFound() {
  return (
    <main className="relative isolate z-10 flex min-h-[75svh] flex-1 items-center justify-center overflow-hidden bg-white px-5 py-20 md:py-28">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-[clamp(14rem,50vw,60rem)] leading-none font-medium tracking-tight text-neutral-100/70 select-none">404</span>
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="gradient-text text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.1] font-medium uppercase">Page not found</h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-600 md:text-xl">Sorry, we couldn’t find the page you’re looking for. It may have been moved or the URL may be incorrect</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 md:mt-14">
          <GoBackButton className="min-w-44 bg-white md:text-base cursor-pointer" />
          <Button href="/" className="min-w-44 md:text-base">GO TO HOME</Button>
        </div>
      </div>
    </main>
  );
}
