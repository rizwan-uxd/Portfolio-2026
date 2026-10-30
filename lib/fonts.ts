// lib/fonts.ts — Codex uses Geist (sans), JetBrains Mono (labels/code) and Satoshi (data tables).
// Geist and JetBrains Mono are open source (SIL OFL) and ship with next/font/google, so they work out of the box.
// Satoshi is an Indian Type Foundry font (free for commercial use via Fontshare, but not on Google Fonts);
// it is optional, only needed if you want Codex's exact table/data look.
import { Geist, JetBrains_Mono } from "next/font/google";
// import localFont from "next/font/local";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Optional: download Satoshi from fontshare.com into /public/fonts, then:
// export const satoshi = localFont({
//   src: [
//     { path: "../public/fonts/Satoshi-Regular.woff2", weight: "400" },
//     { path: "../public/fonts/Satoshi-Medium.woff2", weight: "500" },
//   ],
//   variable: "--font-satoshi",
// });

// app/layout.tsx (App Router) — or pages/_app.tsx if you're on the Pages Router:
//   import { geist, jetbrainsMono } from "@/lib/fonts";
//   import "./globals.css"; // contains tokens.css
//   <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable} dark`}>
