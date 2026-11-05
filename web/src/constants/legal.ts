export type LegalSection = {
    title: string;
    content: (string | string[])[];
};

export type LegalPageContent = {
    title: string;
    effectiveDate: string;
    effectiveDateLabel: string;
    intro: string;
    sections: LegalSection[];
};

export const privacyPolicy: LegalPageContent = {
    title: "Privacy Policy",
    effectiveDate: "2026-10-02",
    effectiveDateLabel: "October 2, 2026",
    intro:
        "Canada India Strategic Partnership Forum (“CISPF,” “we,” “us,” or “our”) respects your privacy and is committed to protecting personal information entrusted to us. This Privacy Policy describes how CISPF collects, uses, discloses, retains, and protects personal information in connection with our website, membership activities, events, programs, communications, and other interactions.",
    sections: [
        {
            title: "1. Personal Information We Collect",
            content: [
                "Depending on how you interact with CISPF, we may collect:",
                [
                    "name and other identifying information;",
                    "job title, employer, organization, and other professional affiliation information;",
                    "business or personal contact information, including email address, telephone number, and mailing address;",
                    "membership inquiry or membership-interest information;",
                    "information submitted through contact, event registration, newsletter, or other website forms;",
                    "communication preferences and information contained in correspondence or inquiries; and",
                    "other information that you voluntarily provide to CISPF.",
                ],
                "When you use our website, we may also collect limited technical information, such as IP address, browser or device information, referring pages, pages visited, and information about interaction with the website through cookies, analytics tools, or similar technologies.",
            ],
        },
        {
            title: "2. How We Collect Personal Information",
            content: [
                "We may collect personal information directly from you, through our website and forms, through event registrations or membership inquiries, when you opt in to CISPF communications, through professional interactions with CISPF, and through third-party service providers that support our activities. We may also collect information from other lawful sources where permitted by applicable law.",
            ],
        },
        {
            title: "3. How We Use Personal Information",
            content: [
                "CISPF may use personal information to:",
                [
                    "respond to inquiries and membership interest;",
                    "administer membership relationships and organizational activities;",
                    "organize and administer events, meetings, programs, delegations, and related activities;",
                    "send newsletters, event invitations, organizational updates, and other communications to individuals who have consented or where otherwise permitted by law;",
                    "maintain relationships with members, prospective members, stakeholders, and partners;",
                    "operate, maintain, secure, and improve our website and services;",
                    "understand participation and engagement with CISPF activities;",
                    "maintain appropriate business and administrative records; and",
                    "comply with applicable legal, regulatory, accounting, and reporting obligations.",
                ],
                "CISPF will limit its collection and use of personal information to purposes that are reasonable and appropriate in the circumstances.",
            ],
        },
        {
            title: "4. Consent",
            content: [
                "Where required by applicable law, CISPF will obtain consent to collect, use, or disclose personal information. The form of consent may vary depending on the circumstances and sensitivity of the information. Consent may be express or, where permitted by law, implied.",
                "You may withdraw consent to certain uses of your personal information, subject to legal, contractual, or other restrictions and reasonable notice. Withdrawal of consent may affect CISPF’s ability to provide certain services, communications, or opportunities.",
            ],
        },
        {
            title: "5. Electronic Communications",
            content: [
                "CISPF may send newsletters, event invitations, organizational updates, membership information, and other electronic communications to individuals who have opted in or where otherwise permitted by applicable Canadian law. Communications subject to applicable anti-spam requirements will include appropriate identification information and an unsubscribe mechanism.",
                "You may unsubscribe from applicable communications at any time by using the unsubscribe mechanism provided in the communication or by contacting CISPF at cispf@cispf.org.",
            ],
        },
        {
            title: "6. Cookies and Analytics",
            content: [
                "Our website may use cookies, analytics tools, and similar technologies to support website functionality, understand website usage, improve performance, and enhance the user experience. CISPF may use third-party technology providers for these purposes.",
                "You may be able to control or disable cookies through your browser settings. Disabling certain cookies may affect the functionality of portions of the website. CISPF may update this Privacy Policy if the website begins using technologies that require additional disclosure or consent.",
            ],
        },
        {
            title: "7. Service Providers and Other Disclosures",
            content: [
                "CISPF may disclose personal information to service providers that assist with website hosting, information technology, communications, event administration, data management, analytics, or other operational functions. CISPF may also disclose information to professional advisers or governmental, regulatory, or law-enforcement authorities where required or permitted by law.",
                "CISPF does not sell personal information.",
            ],
        },
        {
            title: "8. Affiliation with USISPF",
            content: [
                "CISPF is an independent organization affiliated with the United States India Strategic Partnership Forum (“USISPF”). CISPF may share relevant personal information with USISPF where appropriate to coordinate programs, events, membership activities, stakeholder relationships, communications, and other activities undertaken in connection with the organizations’ affiliation.",
                "Information shared with USISPF may be processed or stored in the United States. CISPF will limit such sharing to information reasonably appropriate for the relevant purpose and will take reasonable measures to protect personal information under its control.",
            ],
        },
        {
            title: "9. Processing Outside Canada",
            content: [
                "CISPF and its service providers may store or process personal information outside Canada, including in the United States and India. Personal information processed in another jurisdiction may be subject to the laws of that jurisdiction and may be accessible to courts, law-enforcement agencies, or governmental authorities in accordance with applicable law.",
                "CISPF remains responsible for personal information under its control and takes reasonable measures to require service providers to protect information appropriately.",
            ],
        },
        {
            title: "10. Event Photography and Recordings",
            content: [
                "CISPF may photograph or record its events and activities. Photographs or recordings may be used on the CISPF website, in publications, on social media, or in other communications relating to CISPF’s mission and activities. Where appropriate, CISPF may provide additional photography or recording notices in connection with particular events.",
            ],
        },
        {
            title: "11. Retention",
            content: [
                "CISPF retains personal information only for as long as reasonably necessary to fulfill the purposes for which it was collected and to satisfy applicable legal, accounting, administrative, and operational requirements. When personal information is no longer required, CISPF will take reasonable steps to securely delete, destroy, or anonymize it, as appropriate.",
            ],
        },
        {
            title: "12. Safeguarding Personal Information",
            content: [
                "CISPF maintains reasonable administrative, technical, and physical safeguards appropriate to the nature and sensitivity of the personal information in its possession or control. No method of electronic transmission or storage is completely secure, and CISPF cannot guarantee absolute security.",
            ],
        },
        {
            title: "13. Access and Correction",
            content: [
                "Subject to applicable law, you may request access to personal information CISPF holds about you and may request correction of information that is inaccurate or incomplete. CISPF may need to verify your identity before responding and may be permitted or required by law to withhold certain information.",
            ],
        },
        {
            title: "14. Third-Party Websites and Services",
            content: [
                "The CISPF website may link to or use websites and services operated by third parties. CISPF is not responsible for the privacy practices, content, or security of third-party websites or services. We encourage users to review the applicable privacy policies before providing personal information.",
            ],
        },
        {
            title: "15. Children’s Privacy",
            content: [
                "CISPF’s website and activities are intended for a professional and business audience and are not directed toward children. CISPF does not knowingly seek to collect personal information from children through its website.",
            ],
        },
        {
            title: "16. Privacy Questions and Complaints",
            content: [
                "Questions, access or correction requests, concerns, or complaints regarding CISPF’s privacy practices may be directed to:",
                "Privacy Contact\nCanada India Strategic Partnership Forum\n145 King St W, Suite 720\nToronto, ON M5H 1J8\nCanada\nEmail: cispf@cispf.org",
                "CISPF will review and respond to privacy concerns in accordance with applicable law. Individuals may also have the right to contact the applicable Canadian privacy regulator if they are dissatisfied with CISPF’s response.",
            ],
        },
        {
            title: "17. Changes to This Privacy Policy",
            content: [
                "CISPF may update this Privacy Policy periodically to reflect changes in its practices, technology, legal requirements, or operations. The current version will be posted on the CISPF website with its effective or last-updated date.",
            ],
        },
    ],
};

export const termsOfUse: LegalPageContent = {
    title: "Terms of Use",
    effectiveDate: "2026-10-02",
    effectiveDateLabel: "October 2, 2026",
    intro:
        "These Terms of Use govern access to and use of the website operated by Canada India Strategic Partnership Forum (“CISPF,” “we,” “us,” or “our”). By accessing or using this website, you agree to these Terms of Use. If you do not agree, please do not use the website.",
    sections: [
        {
            title: "1. Purpose of the Website",
            content: [
                "The CISPF website provides information regarding CISPF, its mission, membership, activities, events, programs, publications, policy analysis, initiatives, and related work. Website content is provided for general informational purposes.",
            ],
        },
        {
            title: "2. No Professional Advice",
            content: [
                "Information made available through the CISPF website is not intended to constitute legal, financial, tax, investment, regulatory, or other professional advice. You should obtain appropriate professional advice before acting or relying on information where your circumstances require such advice.",
            ],
        },
        {
            title: "3. Accuracy and Availability",
            content: [
                "CISPF seeks to provide useful and current information but does not warrant that website content is accurate, complete, current, or error-free. Information may be changed, corrected, updated, or removed without notice. CISPF does not guarantee that the website will always be available, uninterrupted, secure, or free from errors or harmful components.",
            ],
        },
        {
            title: "4. CISPF Intellectual Property",
            content: [
                "Unless otherwise indicated, the CISPF website and CISPF-created content, including reports, articles, policy analysis, event summaries, presentations, photographs, videos, graphics, text, logos, and designs, are owned by or licensed to CISPF and are protected by applicable intellectual property laws.",
                "Users may share links to CISPF content and quote reasonable excerpts for informational, educational, or internal business purposes, provided that CISPF is appropriately attributed and the use does not suggest endorsement by CISPF.",
                "Except as permitted by applicable law or with CISPF’s prior written permission, users may not reproduce an entire CISPF publication, substantially reproduce CISPF content, modify or create derivative works from CISPF content, or commercially exploit CISPF content. Nothing in these Terms grants permission to use CISPF’s name, trademarks, service marks, or logos without prior written permission.",
            ],
        },
        {
            title: "5. Third-Party Names, Logos, and Content",
            content: [
                "The website may display names, trademarks, logos, or materials belonging to CISPF members, sponsors, partners, speakers, contributors, or other third parties. Those materials remain the property of their respective owners. Their appearance on the CISPF website does not grant website users any right or licence to use them.",
                "Views expressed by speakers, members, contributors, authors, or other third parties are their own and do not necessarily represent the views, policies, or positions of CISPF. Inclusion of third-party content does not constitute an endorsement unless expressly stated.",
            ],
        },
        {
            title: "6. Permitted Use",
            content: [
                "You agree to use the website only for lawful purposes. You may not:",
                [
                    "attempt to gain unauthorized access to the website, systems, accounts, or networks;",
                    "interfere with or disrupt the operation or security of the website;",
                    "introduce malware, malicious code, or other harmful material;",
                    "use the website in a manner that violates applicable law or the rights of another person;",
                    "misrepresent your identity or affiliation with CISPF;",
                    "use automated means to access or collect content in a manner that places an unreasonable burden on the website or violates applicable law; or",
                    "use CISPF’s name, content, or website in a manner that falsely suggests sponsorship, endorsement, or affiliation.",
                ],
            ],
        },
        {
            title: "7. Events and Programs",
            content: [
                "CISPF may advertise or facilitate registration for events, programs, delegations, meetings, or other activities through its website or third-party services. CISPF may reasonably change speakers, schedules, formats, venues, or other event details, or cancel or reschedule an event or program.",
                "Individual events or programs may be subject to additional registration, eligibility, cancellation, participation, photography, or other terms. Where such additional terms apply, they will supplement these Terms of Use.",
            ],
        },
        {
            title: "8. Third-Party Websites and Services",
            content: [
                "The website may contain links to or integrate services operated by third parties. Such links and integrations are provided for convenience or informational purposes. CISPF does not control and is not responsible for the content, availability, security, accuracy, or privacy practices of third-party websites or services. A link does not necessarily constitute CISPF’s endorsement of the third party or its products, services, views, or activities.",
            ],
        },
        {
            title: "9. Privacy",
            content: [
                "CISPF’s collection, use, disclosure, retention, and protection of personal information is described in its Privacy Policy. By using the website, you acknowledge that personal information provided through the website will be handled in accordance with the Privacy Policy and applicable law.",
            ],
        },
        {
            title: "10. Disclaimer",
            content: [
                "To the extent permitted by applicable law, the CISPF website and its content are provided on an “as is” and “as available” basis without warranties or representations of any kind, whether express or implied. CISPF disclaims warranties to the extent permitted by law, including warranties regarding accuracy, completeness, availability, fitness for a particular purpose, and non-infringement.",
            ],
        },
        {
            title: "11. Limitation of Liability",
            content: [
                "To the maximum extent permitted by applicable law, CISPF and its directors, officers, employees, representatives, and agents will not be liable for losses or damages arising from or relating to access to, use of, inability to use, or reliance upon the website or its content, including indirect, incidental, special, consequential, or similar damages. Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited.",
            ],
        },
        {
            title: "12. Changes to the Website and These Terms",
            content: [
                "CISPF may modify, suspend, discontinue, or restrict all or any portion of the website at any time. CISPF may also update these Terms of Use periodically. The current version will be posted on the website with its effective or last-updated date. Continued use of the website following an update constitutes acceptance of the updated Terms to the extent permitted by applicable law.",
            ],
        },
        {
            title: "13. Governing Law",
            content: [
                "These Terms of Use and your use of the website are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict-of-law principles. Subject to applicable law, disputes relating to these Terms or the website will be submitted to the courts located in Ontario, Canada.",
            ],
        },
        {
            title: "14. Severability",
            content: [
                "If any provision of these Terms is determined to be invalid, illegal, or unenforceable, the remaining provisions will continue in full force and effect.",
            ],
        },
        {
            title: "15. Contact Us",
            content: [
                "Canada India Strategic Partnership Forum\n145 King St W, Suite 720\nToronto, ON M5H 1J8 Canada\nEmail: cispf@cispf.org",
            ],
        },
    ],
};
