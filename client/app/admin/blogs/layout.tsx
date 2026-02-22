import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Blogs | FOSS Admin",
    description: "Create, edit, and publish blog posts for the FOSS Club NIT Srinagar.",
    robots: { index: false, follow: false },
};

export default function AdminBlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
