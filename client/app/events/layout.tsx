import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events | FOSS Club NIT Srinagar",
    description:
        "Explore all hackathons, workshops, and tech events organized by the FOSS Club at NIT Srinagar. Find upcoming and past events to participate in.",
    keywords: [
        "FOSS Club Events",
        "NIT Srinagar",
        "Hackathon",
        "Workshop",
        "Tech Events",
        "Open Source",
    ],
    openGraph: {
        title: "Events | FOSS Club NIT Srinagar",
        description:
            "Explore hackathons, workshops, and meetups organized by FOSS Club NIT Srinagar.",
        siteName: "FOSS NIT Srinagar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Events | FOSS Club NIT Srinagar",
        description:
            "Explore hackathons, workshops, and meetups organized by FOSS Club NIT Srinagar.",
    },
};

/**
 * EventsLayout Component
 * 
 * Injects route-specific SEO metadata for the `/events` path.
 *
 * @param {Object} props - React children node.
 */
export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
