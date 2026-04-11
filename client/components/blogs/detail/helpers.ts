import { stripHtml } from "@/lib/utils";

export function estimateReadTime(content: string): number {
  const plainText = stripHtml(content);
  const words = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
