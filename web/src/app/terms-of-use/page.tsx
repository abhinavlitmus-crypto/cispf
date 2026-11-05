import LegalPage from "@/components/sections/legal/LegalPage";
import { termsOfUse } from "@/constants/legal";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use | Canada-India Strategic Partnership Forum",
    description: "The terms that govern access to and use of the Canada-India Strategic Partnership Forum website.",
};

export default function TermsOfUsePage() {
    return <LegalPage content={termsOfUse} />
}