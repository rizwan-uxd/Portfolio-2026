import { socialPreview } from "@/lib/content";

// The production origin, for absolute URLs in metadata, the sitemap and robots.txt.
export const site = { url: "https://www.rizwanux.work" };

// Social preview card supplied by the owner, 2026-11-04. Every route sets it explicitly, because a page that defines
// its own openGraph replaces the layout's.
export const previewImage = { url: "/images/social/preview.png", width: 1200, height: 630, alt: socialPreview.alt, type: "image/png" };
