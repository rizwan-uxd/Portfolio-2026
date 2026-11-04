import type { Metadata } from "next";
import { geist, jetbrainsMono, satoshi } from "@/lib/fonts";
import { person } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: `${person.name} | ${person.role}`,
  description: "Designing enterprise products that create measurable business impact.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${satoshi.variable} ${jetbrainsMono.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
