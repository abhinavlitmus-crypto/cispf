import type { Metadata } from "next";
import LegalPage from "@/components/sections/legal/LegalPage";
import { privacyPolicy } from "@/constants/legal";


export const metadata: Metadata = {
    title: "Privacy Policy | Canada-India Strategic Partnership Forum",
    description: "How the Canada-India Strategic Partnership Forum collects, uses, discloses, retains and protects personal information.",
};

export default function PrivacyPolicyPage() {
    return <LegalPage content={privacyPolicy} />
}