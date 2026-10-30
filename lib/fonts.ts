// lib/fonts.ts — Geist for headings and display, Satoshi for body, nav and buttons, JetBrains Mono for labels (design.md).
import { Geist, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const satoshi = localFont({
  src: "../app/fonts/Satoshi-Variable.ttf",
  weight: "300 900",
  variable: "--font-satoshi",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
