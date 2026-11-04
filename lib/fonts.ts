// lib/fonts.ts — Geist for headings and display, Satoshi for body, nav and buttons, JetBrains Mono for labels (design.md).
import { Doto, Geist, JetBrains_Mono } from "next/font/google";
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

// Dotted pixel face for the 404 headline only (owner, 2026-11-04, after the 21st.dev "Pixeleted 404" component).
export const doto = Doto({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-doto",
  display: "swap",
});
