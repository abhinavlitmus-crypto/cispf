import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPolicyDiscussion, getPolicyDiscussionsPage } from "@/lib/content";

type PolicyDiscussionPageProps = { params: Promise<{ slug: string }> };

// Re-read admin portal content at most every 5 minutes; discussions added later render on first visit.
export const revalidate = 300;

// The side columns keep the heading and the article on the same reading column.
const columnClasses = "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.8fr)_minmax(0,1fr)] lg:gap-x-[clamp(1.5rem,2vw,2.5rem)]";

export async function generateStaticParams() {
  const { discussions } = await getPolicyDiscussionsPage();
  return discussions.map((discussion) => ({ slug: discussion.id }));
}

export async function generateMetadata({ params }: PolicyDiscussionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const discussion = await getPolicyDiscussion(slug);
  if (!discussion) return {};

  return {
    title: `${discussion.title} | Canada-India Strategic Partnership Forum`,
    description: `Policy discussion from the Canada-India Strategic Partnership Forum: ${discussion.title}.`,
  };
}

export default async function PolicyDiscussionPage({ params }: PolicyDiscussionPageProps) {
  const { slug } = await params;
  const discussion = await getPolicyDiscussion(slug);
  if (!discussion) notFound();

  return (
    <>
      <main className="bg-white text-black">
        <section aria-labelledby="policy-discussion-heading" className="pt-[clamp(5rem,6vw,6.25rem)]">
          <div className={`mx-auto max-w-[1920px] px-5 md:px-[clamp(1rem,2.6vw,3.125rem)] ${columnClasses}`}>
            <p className="text-base leading-relaxed font-medium md:text-2xl lg:pt-3">Policy Discussions</p>
            <div className="mt-5 lg:mt-0">
              <h1
                id="policy-discussion-heading"
                className="text-[clamp(2.5rem,4.3vw,3.6rem)] leading-[1.1] font-bold text-primary uppercase"
              >
                {discussion.detailTitle}
              </h1>
              {discussion.subtitle && <p className="mt-3 text-lg leading-relaxed md:text-xl">{discussion.subtitle}</p>}

              <dl className="mt-10 grid gap-6 text-base leading-relaxed sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] sm:items-center sm:gap-0 md:mt-14">
                {discussion.author && (
                  <div className="sm:pr-8">
                    <dt className="font-semibold">Author</dt>
                    <dd className="mt-1 text-neutral-800">{discussion.author.name}</dd>
                    {discussion.author.role && <dd className="text-primary">{discussion.author.role}</dd>}
                  </div>
                )}
                {discussion.dateLabel && (
                  <div className="sm:border-l sm:border-neutral-200 sm:py-3 sm:pl-[clamp(2rem,5vw,6rem)]">
                    <dt className="font-semibold">Date</dt>
                    <dd className="mt-1 text-neutral-800"><time dateTime={discussion.date}>{discussion.dateLabel}</time></dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {discussion.detailImage && (
            <div className="relative mx-auto mt-[clamp(2.5rem,4vw,3.75rem)] aspect-[1.3] w-full max-w-[1920px] overflow-hidden sm:aspect-[2.05] md:mx-[clamp(1rem,2.6vw,3.125rem)] md:w-auto lg:aspect-[2.92]">
              <Image
                src={discussion.detailImage}
                alt={discussion.detailImageAlt ?? ""}
                fill
                fetchPriority="high"
                sizes="(min-width: 1920px) 1820px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </section>

        <div className={`mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-20 md:pb-24 ${columnClasses}`}>
          {/* Sanitized in getPolicyDiscussionsPage; styled by .policy-article in globals.css. */}
          <article className="policy-article lg:col-start-2" dangerouslySetInnerHTML={{ __html: discussion.content }} />
        </div>
      </main>
    </>
  );
}
