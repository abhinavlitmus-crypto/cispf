import type { Metadata } from "next";
import ContactForm from "@/components/sections/contact/ContactForm/ContactForm";
import ContactDetails from "@/components/sections/contact/ContactDetails/ContactDetails";

export const metadata: Metadata = {
  title: "Contact Us | Canada-India Strategic Partnership Forum",
  description: "Get in touch with the Canada-India Strategic Partnership Forum.",
};

export default function ContactUsPage() {
  return (
    <main>
      <ContactForm />
      <ContactDetails />
    </main>
  );
}
