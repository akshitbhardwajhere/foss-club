import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | FOSS Admin",
    description: "FOSS Club NIT Srinagar — Admin Command Center.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
