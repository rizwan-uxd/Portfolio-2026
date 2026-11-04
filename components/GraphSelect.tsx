"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { id: string; label: string; group: string };

// A dropdown in the site's own style, in place of the browser's select, whose list ignores our colours and fonts.
// Options are grouped, the list scrolls, and it works with the keyboard: arrows, Home, End, Enter, Escape, and typing a letter.
export function GraphSelect({ value, onChange, options, label, className = "" }: {
  value: string;
  onChange: (id: string) => void;
  options: SelectOption[];
  label: string;
  className?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = options.find((o) => o.id === value);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].id);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") return setOpen(false);
    if (e.key === "Escape") {
      if (open) e.preventDefault();
      return setOpen(false);
    }
    const move = (to: number) => {
      e.preventDefault();
      if (!open) show();
      else setActive(Math.max(0, Math.min(options.length - 1, to)));
    };
    if (e.key === "ArrowDown") return move(open ? active + 1 : 0);
    if (e.key === "ArrowUp") return move(open ? active - 1 : 0);
    if (e.key === "Home") return move(0);
    if (e.key === "End") return move(options.length - 1);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      return open ? pick(active) : show();
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const now = Date.now();
      typed.current.text = (now - typed.current.at < 700 ? typed.current.text : "") + e.key.toLowerCase();
      typed.current.at = now;
      const found = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (found >= 0) {
        if (!open) show();
        setActive(found);
      }
    }
  };

  let lastGroup = "";
  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className="label flex h-10 w-full items-center justify-between gap-3 rounded-btn border border-input bg-background px-4 text-left text-foreground"
      >
        <span className="truncate">{current?.label}</span>
        <svg aria-hidden viewBox="0 0 12 12" className={`size-3 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul id={`${id}-list`} ref={list} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 min-w-56 overflow-auto rounded-btn border border-hairline bg-popover py-1 shadow-lg">
          {options.map((o, i) => {
            const heading = o.group !== lastGroup;
            lastGroup = o.group;
            return (
              <li key={o.id} role="presentation">
                {heading && <p aria-hidden className="micro px-4 pb-1 pt-3 text-muted-foreground">{o.group}</p>}
                <div
                  id={`${id}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={o.id === value}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={`label flex cursor-pointer items-center justify-between gap-3 px-4 py-2 ${i === active ? "bg-secondary" : ""} ${o.id === value ? "text-brand" : "text-foreground"}`}
                >
                  <span>{o.label}</span>
                  {o.id === value && <span aria-hidden>✓</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
