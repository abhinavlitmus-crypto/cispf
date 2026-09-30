function GrowthIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth={4} aria-hidden="true" className={className}>
      <path d="M62 2v16M18 140V18h87v74" />
      <path d="M28 35h27M28 52h27M28 67h27M28 83h27M28 99h27M28 115h27M65 35h30M65 52h30M65 67h30M65 83h30" />
      <path d="M2 140h63v18H2z" />
      <path d="M67 100v58h91" />
      <path d="m70 155 25-42 20 20 32-31" />
      <path d="m158 94-17 5 12 12z" fill="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

export default function OurStory() {
  return (
    <section aria-labelledby="our-story-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(3rem,4vw,5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-[clamp(2rem,4vw,5rem)]">
          <div>
            <h2 id="our-story-heading" className="text-[clamp(2.5rem,3.6vw,4.25rem)] leading-tight font-medium">OUR STORY</h2>
            <p className="mt-4 max-w-[30rem] text-[clamp(1.5rem,2.1vw,2.5rem)] leading-snug text-neutral-400 lg:mt-[clamp(1rem,1.6vw,2rem)] lg:max-w-[42rem] lg:text-neutral-300">
              Built on a proven model. Created for a new corridor.
            </p>
          </div>

          <div className="text-lg leading-relaxed lg:pt-2 lg:text-[clamp(1rem,1.05vw,1.25rem)]">
            <p className="text-2xl leading-normal text-primary lg:text-[length:inherit]">
              CISPF brings the experience of USISPF to a relationship with its own scale, complexity and opportunity.
            </p>

            <hr className="mt-10 w-3/4 border-neutral-200 lg:mt-[clamp(1.5rem,2.5vw,3rem)] lg:w-1/2" />

            <div className="mt-12 flex items-center gap-[clamp(1.5rem,5vw,2.5rem)] lg:mt-[clamp(2rem,2.8vw,3.5rem)] lg:gap-[clamp(1.5rem,2.8vw,3.5rem)]">
              <GrowthIcon className="size-[clamp(5rem,22vw,6rem)] shrink-0 text-primary lg:size-[clamp(6rem,8vw,10rem)]" />
              <p className="flex flex-col">
                <span className="text-[clamp(3rem,13vw,4rem)] leading-none font-semibold text-primary lg:text-[clamp(3.5rem,5.2vw,6.5rem)]">450+</span>
                <span className="mt-1 text-[clamp(1.5rem,6vw,2rem)] leading-tight lg:text-[clamp(1.5rem,2.3vw,2.75rem)]">global companies</span>
              </p>
            </div>

            <p className="mt-10 lg:mt-[clamp(1.5rem,2.2vw,2.5rem)]">
              form its network, helping shape one of the world’s most consequential economic corridors.
            </p>

            <hr className="mt-10 border-neutral-200 lg:mt-[clamp(2rem,2.8vw,3.5rem)] lg:w-[87%]" />

            <div className="mt-12 space-y-8 font-light lg:mt-[clamp(2rem,3.2vw,4rem)] lg:space-y-[clamp(1.5rem,1.9vw,2.25rem)] lg:font-normal">
              <p>
                CISPF takes that experience forward with a dedicated focus on Canada and India—two economies with complementary strengths, growing strategic relevance and significant room to deepen their commercial relationship.
              </p>
              <p>The ambition is simple: move the relationship from potential to scale.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
