import Image from "next/image";

const data = [
  {
    title: "MISSION",
    image: { src: "/about/mission.webp", width: 680, height: 288 },
    description: "To advance the Canada–India partnership through trade, investment and strategic engagement. We help businesses navigate opportunities and strengthen the relationships that support sustained cross-border growth.",
  },
  {
    title: "VISION",
    image: { src: "/about/vision.webp", width: 650, height: 270 },
    description: "A resilient Canada–India partnership where complementary economic strengths, shared strategic interests and strong people-to-people ties create lasting prosperity for both countries.",
  },
  {
    title: "OUR ROLE",
    image: { src: "/about/our-role.webp", width: 620, height: 340 },
    description: "We connect business leaders, investors and policymakers across Canada and India. Through focused dialogue, policy insights and practical partnerships, we help turn shared opportunities into action.",
  },
];

export default function WhoWeAre() {
  return (
    <section aria-labelledby="who-we-are-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,8.6vw,10.5rem)] md:pt-[clamp(3rem,4vw,5rem)] md:pb-[clamp(4rem,8vw,9.5rem)]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[36%_minmax(0,1fr)] lg:gap-0">
          <h2 id="who-we-are-heading" className="text-[clamp(2.25rem,3.1vw,4rem)] leading-none font-medium text-primary">WHO WE ARE</h2>

          <div className="space-y-6 text-base leading-[1.55] lg:space-y-[clamp(1.25rem,1.4vw,1.75rem)] lg:pt-[0.3em] lg:text-[clamp(1rem,0.95vw,1.25rem)]">
            <p className="text-primary">CISPF is where business ambition meets policy influence.</p>
            <p>The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity to build what comes next.</p>
            <p>We bring Canadian and Indian businesses, investors, policymakers and government leaders into the conversations that matter: where markets are opening, where policy needs to evolve and where strategic interests align.</p>
          </div>
        </div>

        <div className="relative mt-10 aspect-3/2 overflow-hidden md:mt-[clamp(3rem,4.6vw,5.5rem)] md:aspect-2000/696">
          <Image src="/about/who-we-are-image.webp" alt="Canadian and Indian delegations meeting across a conference table in front of both countries' flags" fill sizes="(min-width: 768px) 83vw, 100vw" className="object-cover" />
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:mt-[clamp(4rem,6.4vw,7.5rem)] md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-[7.4vw]">
          {data.map(({ title, image, description }) => (
            <li key={title} className="flex flex-col bg-[#FAFAFA] px-8 pt-10 md:px-[clamp(1.5rem,2.15vw,2.75rem)] md:pt-[clamp(2rem,2.6vw,3rem)]">
              <h3 className="text-[clamp(1.375rem,1.27vw,1.75rem)] leading-tight font-semibold text-primary">{title}</h3>
              <p className="mt-4 text-base leading-[1.55] lg:text-[clamp(1rem,0.9vw,1.25rem)]">{description}</p>
              {/* Decorative illustration, sitting on the bottom edge of the card. */}
              <Image src={image.src} alt="" width={image.width} height={image.height} sizes="(min-width: 1024px) 22vw, 90vw" className="mx-auto mt-auto block h-auto w-[94%] pt-10" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
