import type { Metadata } from "next";
import { geist, jetbrainsMono, satoshi } from "@/lib/fonts";
import { person, socialPreview } from "@/lib/content";
import { previewImage, site } from "@/lib/site";
import "./globals.css";

const title = `${person.name} | ${person.role}`;
const description = "Designing enterprise products that create measurable business impact.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: socialPreview.siteName, title, description, locale: "en_US", images: [previewImage] },
  twitter: { card: "summary_large_image", title, description, images: [previewImage] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${satoshi.variable} ${jetbrainsMono.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
