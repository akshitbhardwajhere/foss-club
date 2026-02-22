import type { Metadata } from "next";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Blog {
    title: string;
    content: string;
    author: string;
    tags: string[];
    imageUrl?: string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    try {
        const { id } = await params;
        const res = await axios.get(`${API_BASE}/api/blogs/${id}`);
        const blog: Blog = res.data;

        const description = blog.content
            .replace(/<[^>]+>/g, "")
            .slice(0, 160)
            .trim();

        return {
            title: `${blog.title} | FOSS Club NIT Srinagar`,
            description,
            keywords: [
                ...blog.tags,
                "FOSS Club",
                "NIT Srinagar",
                "Tech Blog",
                blog.author,
            ],
            authors: [{ name: blog.author }],
            openGraph: {
                title: blog.title,
                description,
                siteName: "FOSS NIT Srinagar",
                locale: "en_US",
                type: "article",
                authors: [blog.author],
                ...(blog.imageUrl ? { images: [{ url: blog.imageUrl }] } : {}),
            },
            twitter: {
                card: "summary_large_image",
                title: blog.title,
                description,
                ...(blog.imageUrl ? { images: [blog.imageUrl] } : {}),
            },
        };
    } catch {
        return {
            title: "Blog Post | FOSS Club NIT Srinagar",
            description: "Read this technical blog post by a FOSS Club NIT Srinagar student developer.",
        };
    }
}

export default function BlogDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
