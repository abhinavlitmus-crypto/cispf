import Image from "next/image";
import { Binoculars, BriefcaseBusiness, Target } from "lucide-react";

const data = [
  {
    title: "MISSION",
    icon: Target,
    image: "/about/tag1.svg",
    alt: "Stock market chart glowing over a city skyline at night",
    description: "To accelerate the Canada–India partnership through business, policy and strategic engagement.",
  },
  {
    title: "VISION",
    icon: Binoculars,
    image: "/about/tag2.svg",
    alt: "Business leaders shaking hands in a meeting room",
    description: "To accelerate the Canada–India partnership through business, policy and strategic engagement.",
  },
  {
    title: "OUR ROLE",
    icon: BriefcaseBusiness,
    image: "/about/tag3.svg",
    alt: "Hands assembling a complex network of connectors",
    description: "To accelerate the Canada–India partnership through business, policy and strategic engagement.",
  },
];

export default function WhoWeAre() {
  return (
    <section aria-labelledby="who-we-are-heading" className="bg-white text-black">
      <div className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] lg:pt-[clamp(3rem,4vw,5rem)] lg:pb-[clamp(4rem,6vw,7rem)]">
        <div className="grid grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:gap-[clamp(2rem,4vw,5rem)] lg:text-left">
          <div>
            <h2 id="who-we-are-heading" className="text-[clamp(2.5rem,3.6vw,4.25rem)] leading-tight font-medium">WHO WE ARE</h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-[clamp(1.5rem,2.1vw,2.5rem)] leading-snug text-neutral-400 lg:mx-0 lg:mt-[clamp(1rem,1.6vw,2rem)] lg:max-w-[42rem] lg:text-neutral-300">
              Shaping what Canada and India can build together.
            </p>
          </div>

          <div className="mx-auto max-w-[40rem] space-y-8 text-lg leading-relaxed lg:mx-0 lg:max-w-none lg:space-y-[clamp(1.5rem,1.9vw,2.25rem)] lg:pt-2 lg:text-[clamp(1rem,1.05vw,1.25rem)]">
            <p className="text-2xl leading-normal text-primary lg:text-[length:inherit]">CISPF is where business ambition meets policy influence.</p>
            <p>The Canada–India Strategic Partnership Forum is a platform for leaders who see beyond the current state of the relationship—and the opportunity to build what comes next.</p>
            <p>We bring Canadian and Indian businesses, investors, policymakers and government leaders into the conversations that matter: where markets are opening, where policy needs to evolve and where strategic interests align.</p>
          </div>
        </div>

        <ul className="mt-24 grid grid-cols-1 gap-16 lg:mt-[clamp(3rem,5.5vw,6.5rem)] lg:grid-cols-3 lg:gap-[clamp(1rem,1.7vw,2rem)]">
          {data.map(({ title, icon: Icon, image, alt, description }) => (
            <li key={title} className="group relative aspect-591/531 overflow-hidden text-white">
              <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none" />

              <div className="relative flex h-full flex-col justify-between p-[clamp(2rem,7vw,3.5rem)] lg:p-[clamp(1.5rem,2.3vw,2.75rem)]">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-[clamp(3rem,11vw,5.5rem)] lg:size-[clamp(2.75rem,3.2vw,4rem)]" />
                <div className="transition-transform duration-500 ease-out group-hover:-translate-y-[clamp(1.5rem,1.9vw,2.25rem)] motion-reduce:transition-none">
                  <h3 className="text-[clamp(2rem,6.5vw,3rem)] leading-tight font-semibold lg:text-[clamp(1.75rem,2.1vw,2.75rem)]">{title}</h3>
                  <p className="mt-2 max-w-[30rem] text-[clamp(1.125rem,4vw,1.5rem)] leading-relaxed lg:text-[clamp(0.875rem,0.95vw,1.125rem)]">{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid grid-cols-1 lg:mt-[clamp(4rem,6vw,7rem)] lg:grid-cols-2 lg:gap-[clamp(2rem,4vw,5rem)]">
          <p className="text-center text-lg leading-relaxed lg:col-start-2 lg:text-left lg:text-[clamp(1rem,1.05vw,1.25rem)]">
            CISPF creates the connections, conversations and insights that help businesses navigate opportunity and help decision-makers understand what is possible.
          </p>
        </div>
      </div>
    </section>
  );
}
