import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login | FOSS Club NIT Srinagar",
    description: "Sign in to the FOSS Club NIT Srinagar admin portal.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
