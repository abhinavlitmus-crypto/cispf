"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { BsArrowUpRight } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import type { TeamCardProps } from "@/utilities/ComponentTypes";

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <article aria-labelledby={`${member.id}-name`} className="border-b border-black/10 pb-8 last:border-0 sm:border-0 sm:pb-0">
      <Dialog.Root>
        <div className="relative aspect-[419/440] w-full overflow-hidden bg-neutral-100">
          <Image src={member.image} alt="" fill sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 90vw" className="object-cover" />
          <Dialog.Trigger aria-label={`Read ${member.name}'s biography`} className="group absolute inset-0 w-full cursor-pointer text-left">
          <span aria-hidden="true" className="absolute inset-0 hidden bg-[image:var(--gradient-card-overlay)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none md:block" />
          <span className="absolute inset-0 flex items-end p-8 text-white md:items-center md:justify-center md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 motion-reduce:transition-none">
            <span className="flex items-center gap-1 text-sm drop-shadow-md md:text-2xl">BIO <BsArrowUpRight aria-hidden="true" /></span>
          </span>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex h-[min(760px,calc(100dvh-3rem))] w-[calc(100%-3rem)] max-w-[1067px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-hidden bg-white p-6 text-black transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none md:grid md:h-[min(446px,calc(100dvh-3rem))] md:grid-cols-[27%_minmax(0,1fr)] md:gap-8 md:px-8 md:py-10">
            <Dialog.Close aria-label="Close biography" className="absolute top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center bg-white text-neutral-500 md:top-6 md:right-5">
              <TfiClose aria-hidden="true" className="size-6" />
            </Dialog.Close>
            <div className="flex shrink-0 items-end gap-4 pr-12 md:min-h-0 md:flex-col md:items-start md:pr-0">
              <div className="relative aspect-[170/192] h-[min(24dvh,192px)] max-w-full md:aspect-auto md:h-auto md:min-h-0 md:w-full md:flex-1">
                <Image src={member.image} alt={member.name} fill sizes="(min-width: 768px) 272px, 170px" className="object-cover" />
              </div>
              {member.linkedinUrl ? (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <FaLinkedinIn aria-hidden="true" className="size-6" />
                </a>
              ) : (
                <span role="img" aria-label="LinkedIn profile not yet available" title="LinkedIn profile not yet available" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <FaLinkedinIn aria-hidden="true" className="size-6" />
                </span>
              )}
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <p className="pr-10 text-sm uppercase text-primary md:text-base">{member.title}</p>
              <Dialog.Title className="mt-1 pr-10 text-2xl leading-tight font-normal md:mt-2 md:text-3xl">{member.name}</Dialog.Title>
              <Dialog.Description className="sr-only">Biography of {member.name}</Dialog.Description>
              <div tabIndex={0} role="region" aria-label={`${member.name}'s biography`} className="mt-7 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-4 text-base leading-[1.3] [scrollbar-color:var(--color-primary)_#e5e5e5] [scrollbar-width:thin] md:mt-8 md:text-lg">
                {member.biography.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="mb-5 whitespace-pre-line last:mb-0">{paragraph}</p>)}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <p className="mt-6 text-sm uppercase text-primary md:mt-8 md:text-base">{member.title}</p>
      <h2 id={`${member.id}-name`} className="mt-2 text-[clamp(1.375rem,1.6vw,1.875rem)] leading-tight font-normal">{member.name}</h2>
    </article>
  );
}
