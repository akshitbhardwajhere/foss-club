import type { Metadata } from "next";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Event {
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    try {
        const { id } = await params;
        const res = await axios.get(`${API_BASE}/api/events/${id}`);
        const event: Event = res.data;

        const description = `${event.description.slice(0, 140).trim()} — ${event.location}`;
        const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        return {
            title: `${event.title} | FOSS Club NIT Srinagar`,
            description,
            keywords: [
                "FOSS Club",
                "NIT Srinagar",
                event.title,
                event.location,
                "Tech Event",
                formattedDate,
            ],
            openGraph: {
                title: event.title,
                description,
                siteName: "FOSS NIT Srinagar",
                locale: "en_US",
                type: "website",
                ...(event.imageUrl ? { images: [{ url: event.imageUrl }] } : {}),
            },
            twitter: {
                card: "summary_large_image",
                title: event.title,
                description,
                ...(event.imageUrl ? { images: [event.imageUrl] } : {}),
            },
        };
    } catch {
        return {
            title: "Event | FOSS Club NIT Srinagar",
            description: "View event details from the FOSS Club at NIT Srinagar.",
        };
    }
}

export default function EventDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
