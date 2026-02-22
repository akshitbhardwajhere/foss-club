import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Events | FOSS Admin",
    description: "Create, edit, and manage events for the FOSS Club NIT Srinagar.",
    robots: { index: false, follow: false },
};

export default function AdminEventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
