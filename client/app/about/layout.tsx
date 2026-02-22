import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | FOSS Club NIT Srinagar",
    description:
        "Learn about the Free and Open Source Software Club at NIT Srinagar — our mission, community, and what we do to bridge academic learning with real-world software engineering.",
    keywords: [
        "FOSS Club",
        "NIT Srinagar",
        "About",
        "Open Source Community",
        "Mission",
        "Student Club",
    ],
    openGraph: {
        title: "About | FOSS Club NIT Srinagar",
        description:
            "Learn about the FOSS Club at NIT Srinagar — our mission, community values, and what we do.",
        siteName: "FOSS NIT Srinagar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About | FOSS Club NIT Srinagar",
        description:
            "Learn about the FOSS Club at NIT Srinagar — our mission, community values, and what we do.",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
