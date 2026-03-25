import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Team | FOSS Club NIT Srinagar",
    description:
        "Meet the passionate student developers, designers, and creators who form the core team of the FOSS Club at NIT Srinagar.",
    keywords: [
        "FOSS Club Team",
        "NIT Srinagar",
        "Core Team",
        "Student Developers",
        "Open Source Contributors",
    ],
    openGraph: {
        title: "Team | FOSS Club NIT Srinagar",
        description:
            "Meet the student innovators who form the core team of the FOSS Club at NIT Srinagar.",
        siteName: "FOSS NIT Srinagar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Team | FOSS Club NIT Srinagar",
        description:
            "Meet the student innovators who form the core team of the FOSS Club at NIT Srinagar.",
    },
};

/**
 * TeamLayout Component
 * 
 * Injects route-specific SEO metadata for the `/team` path.
 *
 * @param {Object} props - React children node.
 */
export default function TeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
