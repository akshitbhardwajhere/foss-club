import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | FOSS Club NIT Srinagar",
    description:
        "Read technical articles, tutorials, and insights written by student developers at FOSS Club NIT Srinagar. Explore topics from Linux to DevOps, Web Dev, and more.",
    keywords: [
        "FOSS Club Blog",
        "NIT Srinagar",
        "Tech Articles",
        "Open Source",
        "Tutorials",
        "Student Blogs",
    ],
    openGraph: {
        title: "Blog | FOSS Club NIT Srinagar",
        description:
            "Read technical articles and tutorials by student developers at FOSS Club NIT Srinagar.",
        siteName: "FOSS NIT Srinagar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | FOSS Club NIT Srinagar",
        description:
            "Read technical articles and tutorials by student developers at FOSS Club NIT Srinagar.",
    },
};

/**
 * BlogsLayout Component
 * 
 * Injects route-specific SEO metadata for the `/blogs` path.
 *
 * @param {Object} props - React children node.
 */
export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
