import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | FOSS Club NIT Srinagar",
    description:
        "Get in touch with the FOSS Club at NIT Srinagar. Reach out to collaborate, ask questions, or join our open-source community of student developers.",
    keywords: [
        "FOSS Club",
        "NIT Srinagar",
        "Contact",
        "Join",
        "Collaborate",
        "Open Source",
    ],
    openGraph: {
        title: "Contact | FOSS Club NIT Srinagar",
        description:
            "Reach out to the FOSS Club at NIT Srinagar — collaborate, ask questions, or apply to join.",
        siteName: "FOSS NIT Srinagar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact | FOSS Club NIT Srinagar",
        description:
            "Reach out to the FOSS Club at NIT Srinagar — collaborate, ask questions, or apply to join.",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
