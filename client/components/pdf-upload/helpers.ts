export function getFilenameFromUrl(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split("/");
    const last = parts[parts.length - 1];
    const withoutVersion = last.replace(/^v\d+_/, "");
    return withoutVersion || "document.pdf";
  } catch {
    return "document.pdf";
  }
}
