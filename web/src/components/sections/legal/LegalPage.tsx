import { LegalPageContent } from "@/constants/legal";

export default function LegalPage({ content }: { content: LegalPageContent }) {
    return (
        <main className="relative z-10 bg-white text-black">
            <article aria-labelledby="legal-heading" className="mx-auto max-w-[1920px] px-5 pt-[clamp(5rem,6vw,6.25rem)] pb-16 md:px-[clamp(1rem,2.16vw,3.125rem)] md:pb-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.8fr)_minmax(0,1fr)] lg:gap-x-[clamp(1.5rem,2vw,2.5rem)]">
                <div className="min-w-0 lg:col-start-2">
                    <h1 id="legal-heading" className="gradient-text w-fit text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[1.1] font-medium uppercase">{content.title}</h1>
                    <p className="mt-4 text-sm text-neutral-600 md:text-base">
                        Effective Date: <time dateTime={content.effectiveDate}>{content.effectiveDateLabel}</time>
                    </p>

                    <div className="policy-article mt-12 md:mt-20">
                        <p>{content.intro}</p>
                        {content.sections.map((section) => (
                            <section key={section.title} className="mt-14 md:mt-20">
                                <h2>{section.title}</h2>
                                {section.content.map((block, index) =>
                                    Array.isArray(block) ? (
                                        <ul key={index}>{block.map((item) => <li key={item}>{item}</li>)}</ul>
                                    ) : (
                                        <p key={index} className="whitespace-pre-line">{block}</p>
                                    ),
                                )}
                            </section>
                        ))}

                    </div>
                </div>
            </article>
        </main>
    )
}