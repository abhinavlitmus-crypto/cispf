"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { TfiClose } from "react-icons/tfi";
import Button from "@/components/common/Button/Button";
import ContactEnquiryForm from "@/components/common/ContactEnquiryForm/ContactEnquiryForm";

type ContactPopupProps = {
  /** Content of the button that opens the popup. */
  children: ReactNode;
  triggerClassName?: string;
};

export default function ContactPopup({ children, triggerClassName }: ContactPopupProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button className={triggerClassName} />}>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[1067px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white text-black transition-[opacity,scale] duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none md:grid-cols-[42%_minmax(0,1fr)]">
          <Dialog.Close aria-label="Close" className="absolute top-4 right-4 flex size-11 items-center justify-center text-black transition-transform duration-300 hover:rotate-90 motion-reduce:transition-none md:top-6 md:right-6 cursor-pointer">
            <TfiClose aria-hidden="true" className="size-6" />
          </Dialog.Close>

          <div className="relative hidden items-center justify-center md:flex">
            <Image src="/Icon/white-leaf.svg" alt="" aria-hidden="true" width={322} height={348} className="pointer-events-none h-auto w-[70%] max-w-[325px]" />
          </div>

          <div className="px-6 pt-16 pb-10 md:py-[clamp(3rem,5vw,5.5rem)] md:pr-[clamp(2rem,6%,4rem)] md:pl-0">
            <Dialog.Title className="gradient-text text-[clamp(2rem,2.8vw,2.75rem)] leading-tight  font-medium inline">CONTACT US</Dialog.Title>
            <Dialog.Description className="sr-only">Send a message to the Canada-India Strategic Partnership Forum.</Dialog.Description>
            <ContactEnquiryForm
              className="mt-8 md:mt-10"
              actionsClassName="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 "
              buttonClassName="cursor-pointer"
              actions={<Link href="/contact-us" className="text-sm text-neutral-500 underline underline-offset-4 hover:text-primary">Try other ways to contact</Link>}
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
