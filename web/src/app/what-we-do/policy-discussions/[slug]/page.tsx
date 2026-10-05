import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JoinUs from "@/components/common/JoinUs/JoinUs";
import { policyDiscussionItems, type PolicyText } from "@/constants/policy";

type PolicyDiscussionPageProps = { params: Promise<{ slug: string }> };

const discussions = policyDiscussionItems.filter((discussion) => discussion.detailTitle && discussion.detailImage && discussion.sections);

// The side columns keep the heading and the article on the same reading column.
const columnClasses = "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.8fr)_minmax(0,1fr)] lg:gap-x-[clamp(1.5rem,2vw,2.5rem)]";
const paragraphClasses = "text-base leading-relaxed text-neutral-800 md:text-lg";

function getDiscussion(slug: string) {
  return discussions.find((discussion) => discussion.id === slug);
}

function renderText(text: PolicyText, references: string[]) {
  return text.map((part, index) => typeof part === "string" ? part : (
    <sup key={index}>
      <a href={references[part - 1]} target="_blank" rel="noopener noreferrer" aria-label={`Source ${part} (opens in a new tab)`} className="px-0.5 font-medium text-blue-700 underline">{part}</a>
    </sup>
  ));
}

export function generateStaticParams() {
  return discussions.map((discussion) => ({ slug: discussion.id }));
}

export async function generateMetadata({ params }: PolicyDiscussionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const discussion = getDiscussion(slug);
  if (!discussion) return {};

  return {
    title: `${discussion.title} | Canada-India Strategic Partnership Forum`,
    description: `Policy discussion from the Canada-India Strategic Partnership Forum: ${discussion.title}.`,
  };
}

export default async function PolicyDiscussionPage({ params }: PolicyDiscussionPageProps) {
  const { slug } = await params;
  const discussion = getDiscussion(slug);
  if (!discussion?.detailTitle || !discussion.detailImage || !discussion.sections) notFound();

  const references = discussion.references ?? [];

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
                    <dd className="text-primary">{discussion.author.role}</dd>
                  </div>
                )}
                <div className="sm:border-l sm:border-neutral-200 sm:py-3 sm:pl-[clamp(2rem,5vw,6rem)]">
                  <dt className="font-semibold">Date</dt>
                  <dd className="mt-1 text-neutral-800"><time dateTime={discussion.date}>{discussion.dateLabel}</time></dd>
                </div>
              </dl>
            </div>
          </div>

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
        </section>

        <div className={`mx-auto max-w-[1920px] px-5 pt-12 pb-16 md:px-[clamp(1rem,2.6vw,3.125rem)] md:pt-20 md:pb-24 ${columnClasses}`}>
          <article className="lg:col-start-2">
            {discussion.sections.map((section, sectionIndex) => (
              <section key={section.title} aria-labelledby={`policy-discussion-section-${sectionIndex}`} className="mt-14 first:mt-0 md:mt-20">
                {section.note ? (
                  <>
                    <h2 id={`policy-discussion-section-${sectionIndex}`} className="text-base leading-relaxed font-medium text-primary italic md:text-lg">{section.title}</h2>
                    <p className="text-sm leading-relaxed text-neutral-800 md:text-base">{section.note}</p>
                  </>
                ) : (
                  <h2 id={`policy-discussion-section-${sectionIndex}`} className="text-[clamp(1.5rem,1.6vw,1.75rem)] leading-tight font-medium">{section.title}</h2>
                )}

                {section.blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className={`mt-8 ${block.type === "text" && block.boxed ? "bg-primary/[0.03] px-5 py-7 md:px-8 md:py-9" : ""}`}>
                    {block.heading && <h3 className="mb-2 text-base leading-relaxed font-semibold md:text-lg">{block.heading}</h3>}
                    {block.type === "list" ? (
                      <ul className={`list-disc pl-5 ${paragraphClasses}`}>
                        {block.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    ) : (
                      block.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className={`${paragraphClasses} ${paragraphIndex ? "mt-6 md:mt-8" : ""} ${block.boxed && !paragraphIndex ? "mt-4" : ""}`}>
                          {renderText(paragraph, references)}
                        </p>
                      ))
                    )}
                  </div>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
      {/* <JoinUs /> */}
    </>
  );
}
