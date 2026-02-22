import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Team | FOSS Admin",
    description: "Add and manage team members for the FOSS Club NIT Srinagar.",
    robots: { index: false, follow: false },
};

export default function AdminTeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
