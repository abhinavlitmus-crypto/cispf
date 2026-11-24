import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import { getEvent, getEvents } from "@/lib/content";

type EventPageProps = { params: Promise<{ slug: string }> };

// Re-read admin portal content at most every 5 minutes; events added later render on first visit.
export const revalidate = 300;

export async function generateStaticParams() {
  const { upcoming, past } = await getEvents();
  return [...upcoming, ...past].map((event) => ({ slug: event.id }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  return {
    title: `${event.title} | Canada-India Strategic Partnership Forum`,
    description: event.summary,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const [detailImage, ...galleryImages] = event.gallery ?? [];
  const isPast = event.date < new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());

  return (
    <>
      <main className="bg-white text-black">
        <section aria-labelledby="event-heading" className="pt-[clamp(5rem,6vw,6.25rem)]">
          <div className="mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)]">
            <p className="text-center text-base leading-relaxed md:text-lg">{isPast ? "Past Events" : "Upcoming Events"}</p>
            <h1
              id="event-heading"
              className="mx-auto mt-5 max-w-[65rem] text-center text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.1] font-medium text-primary uppercase"
            >
              {event.detailTitle ?? event.title}
            </h1>
          </div>

          <div className="relative mx-auto mt-[clamp(2.5rem,4vw,3.75rem)] aspect-[1.3] w-full max-w-[1920px] overflow-hidden sm:aspect-[2.05] md:mx-[clamp(1rem,2.6vw,3.125rem)] md:w-auto lg:aspect-[2.47]">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              fetchPriority="high"
              sizes="(min-width: 1920px) 1820px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section aria-label="Event details and photos" className="mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-16 md:pb-24">
          <div className={`grid gap-7 sm:items-center sm:gap-[clamp(2rem,2.6vw,2.5rem)] ${detailImage ? "sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]" : ""}`}>
            {detailImage && (
              <div className="relative aspect-[0.95] overflow-hidden">
                <Image
                  src={detailImage.src}
                  alt={detailImage.alt}
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-relaxed">
                <span className="font-medium text-primary">Date of discussion :</span>
                <time dateTime={event.date} className="text-neutral-800">{event.dateLabel}</time>
              </p>
              <p className="mt-6 text-base leading-relaxed whitespace-pre-line text-neutral-800 md:mt-8 md:text-lg">
                {event.detailSummary || event.summary}
              </p>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="mt-8 grid gap-7 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:items-start sm:gap-[clamp(2rem,2.6vw,2.5rem)] md:mt-9">
              {galleryImages.map((image) => (
                <div key={image.src} className="relative aspect-[1.5] overflow-hidden sm:even:aspect-[1.65]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <JoinUs />
    </>
  );
}
