"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/content";
import { DottedArrow } from "@/components/DottedArrow";

// Floating scroll-to-top button (owner, 2026-11-03). It appears with the floating nav, once the hero CTA has scrolled
// out above, and sits bottom right: beside the AI twin bar from lg, above it below lg where the bar runs full width.
// `bar` is false on pages without the AI twin bar (case studies). Where there is a bar, the button follows it: while the bar is
// hidden (before Selected works ends, and at Contact) the button drops into the bar's place in the corner.
export function ScrollTop({ bar = true }: { bar?: boolean }) {
  const [shown, setShown] = useState(false);
  const [barShown, setBarShown] = useState(false);

  useEffect(() => {
    const field = bar ? document.querySelector(".twin-field") : null;
    if (!field) return;
    const read = () => setBarShown(field.getAttribute("data-visible") === "true");
    read();
    const mo = new MutationObserver(read);
    mo.observe(field, { attributes: true, attributeFilter: ["data-visible"] });
    return () => mo.disconnect();
  }, [bar]);

  useEffect(() => {
    const anchor = document.querySelector("[data-nav-reveal-after]");
    if (!anchor) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button type="button" onClick={toTop} data-shown={shown} data-bar={bar && barShown} inert={!shown} aria-label={contact.toTop} title={contact.toTop} className="to-top">
      <DottedArrow direction="up" tone="outline" />
    </button>
  );
}
