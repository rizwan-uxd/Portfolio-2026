"use client";

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GlowButton } from "@/components/Header";
import { aiTwin, person } from "@/lib/content";
import type { TwinAnswer } from "@/lib/twin";

type Message = { id: number; from: "you"; text: string } | { id: number; from: "twin"; answer: TwinAnswer };

const starters = aiTwin.cards.map((c) => c.question).concat(aiTwin.starters);
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const cssToken = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

function Sparkle({ className = "" }: { className?: string }) {
  return <img src="/figma/icon-sparkle.svg" alt="" className={`twin-spark block size-6 shrink-0 ${className}`} />;
}

function Icon({ children, className = "size-4" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`shrink-0 ${className}`}>
      {children}
    </svg>
  );
}

const ArrowUp = () => <Icon><path d="M8 13V3M4 7l4-4 4 4" /></Icon>;

function Avatar({ size }: { size: number }) {
  return (
    <span className="twin-avatar" style={{ width: size, height: size }}>
      <Image src="/images/profile.png" alt="" width={size * 2} height={size * 2} className="size-full rounded-full object-cover" />
      <span className="twin-avatar-badge"><img src="/figma/icon-sparkle.svg" alt="" className="block size-full" /></span>
    </span>
  );
}

function TwinLabel() {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={24} />
      <span className="label text-muted-foreground">{aiTwin.title}</span>
    </div>
  );
}

// Types each question into the bar's placeholder, holds it, erases it, then moves on to the next one.
function useTypedQuestion(running: boolean) {
  const [text, setText] = useState(aiTwin.barQuestions[0]);

  useEffect(() => {
    if (!running || reducedMotion()) return;
    let timer = 0;
    let cancelled = false;
    const wait = (ms: number) => new Promise((resolve) => { timer = window.setTimeout(resolve, ms); });

    (async () => {
      for (let q = 0; !cancelled; q = (q + 1) % aiTwin.barQuestions.length) {
        const question = aiTwin.barQuestions[q];
        for (let i = q === 0 ? question.length : 1; i <= question.length && !cancelled; i++) {
          setText(question.slice(0, i));
          await wait(cssToken("--twin-type-char"));
        }
        await wait(cssToken("--twin-type-hold"));
        for (let i = question.length - 1; i >= 0 && !cancelled; i--) {
          setText(question.slice(0, i));
          await wait(cssToken("--twin-type-erase"));
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setText(aiTwin.barQuestions[0]);
    };
  }, [running]);

  return text;
}

// Fires with true once `element` has come up past the line `margin` (a negative rootMargin) above the viewport bottom.
function observeCrossed(element: Element | null, margin: string, onChange: (crossed: boolean) => void) {
  if (!element) return () => {};
  const io = new IntersectionObserver(
    ([e]) => onChange(e.isIntersecting),
    { rootMargin: `1000000px 0px ${margin} 0px` }, // the top is open, so a jump from far below to far above still counts
  );
  io.observe(element);
  return () => io.disconnect();
}

function emailChat(messages: Message[]) {
  const transcript = messages
    .map((m) => (m.from === "you" ? `Me: ${m.text}` : `Twin: ${[m.answer.lead, ...(m.answer.points ?? []).map((p) => `- ${p}`)].join("\n")}`))
    .join("\n\n");
  return `mailto:${person.email}?subject=${encodeURIComponent(aiTwin.emailSubject)}&body=${encodeURIComponent(transcript)}`;
}

function Answer({ answer }: { answer: TwinAnswer }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-foreground">{answer.lead}</p>
      {answer.points && (
        <ul className="twin-bullets flex flex-col gap-2 text-muted-foreground">
          {answer.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}
      {answer.link && (
        <a href={answer.link.href} target={answer.link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="w-fit text-brand underline underline-offset-2">
          {answer.link.label}
        </a>
      )}
    </div>
  );
}

// Floating ask bar and chat panel. Behaviour and timings measured from surinder.design, colours from our tokens (animations.md).
export function AiTwinBar() {
  const [pastWorks, setPastWorks] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState("");
  const [keyboardUp, setKeyboardUp] = useState(false);

  const barRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);
  const chat = useRef(0); // bumps on New chat, so a late answer can't land in the new conversation
  const nextId = useRef(0);
  const wasOpen = useRef(false);

  const barShown = pastWorks && !atContact;
  const typed = useTypedQuestion(barShown && !open);
  const asked = new Set(messages.flatMap((m) => (m.from === "you" ? [m.text.toLowerCase()] : [])));
  const followUps = starters.filter((s) => !asked.has(s.toLowerCase())).slice(0, 3);
  const lastQuestionId = messages.findLast((m) => m.from === "you")?.id;

  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const stopReveal = observeCrossed(document.querySelector("[data-twin-reveal-after]"), css.getPropertyValue("--twin-reveal-margin").trim(), setPastWorks);
    const stopHide = observeCrossed(document.querySelector("#contact"), css.getPropertyValue("--twin-hide-margin").trim(), setAtContact);
    return () => {
      stopReveal();
      stopHide();
    };
  }, []);

  // While open: the page behind stops scrolling, Esc minimizes, the sheet sits above the on-screen keyboard.
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) barRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    root.style.paddingRight = scrollbar ? `${scrollbar}px` : "";

    // Focusing on touch would open the keyboard over the intro, so the keyboard waits for a tap in the field.
    if (matchMedia("(hover: hover)").matches) inputRef.current?.focus();
    else panelRef.current?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const panel = panelRef.current;
    const viewport = window.visualViewport;
    const fit = () => {
      if (!viewport || !panel) return;
      const covered = window.innerHeight - viewport.height - viewport.offsetTop;
      panel.style.setProperty("--twin-h", `${viewport.height}px`);
      panel.style.setProperty("--twin-kb", `${Math.max(covered, 0)}px`);
      setKeyboardUp(covered > cssToken("--twin-kb-threshold"));
    };
    fit();
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);

    return () => {
      root.style.overflow = "";
      root.style.paddingRight = "";
      window.removeEventListener("keydown", onKey);
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
    };
  }, [open]);

  // Keep the newest question at the top of the thread, with its answer right below it.
  useEffect(() => {
    const thread = threadRef.current;
    const question = lastQuestionRef.current;
    if (thread && question) thread.scrollTo({ top: question.offsetTop - cssToken("--twin-thread-fade"), behavior: reducedMotion() ? "auto" : "smooth" });
  }, [lastQuestionId, pending]);

  function trapTab(e: KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input")];
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function ask(raw: string) {
    const question = raw.trim();
    if (!question || pending) return;
    const thisChat = chat.current;
    setDraft("");
    setPending(true);
    setMessages((m) => [...m, { id: nextId.current++, from: "you", text: question }]);

    const think = new Promise((resolve) => setTimeout(resolve, reducedMotion() ? 0 : cssToken("--twin-think")));
    const reply: TwinAnswer = await fetch("/api/twin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .catch(() => ({ lead: aiTwin.error, link: { href: `mailto:${person.email}`, label: person.email } }));
    await think;

    if (thisChat !== chat.current) return;
    setMessages((m) => [...m, { id: nextId.current++, from: "twin", answer: reply }]);
    setPending(false);
  }

  function newChat() {
    chat.current++;
    setMessages([]);
    setDraft("");
    setPending(false);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <div className="twin-root">
      <div data-visible={barShown} data-stage={open ? "panel" : "bar"} inert={!barShown || open} className="twin-field">
        <div className="twin-glass">
          <button ref={barRef} type="button" aria-haspopup="dialog" aria-label={aiTwin.ask} onClick={() => setOpen(true)} className="twin-composer w-full text-left">
            <Sparkle />
            <span aria-hidden className="min-w-0 flex-1 truncate text-muted-foreground">{typed}&#8203;</span>
            <span aria-hidden className="twin-send"><ArrowUp /></span>
          </button>
        </div>
      </div>

      <div data-open={open} className="twin-scrim" onClick={() => setOpen(false)} />

      <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="twin-title" tabIndex={-1} data-open={open} data-kb={keyboardUp ? "up" : "down"} inert={!open} onKeyDown={trapTab} className="twin-panel">
        <div className="twin-sheet">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline px-3 py-3 lg:px-6">
            <div className="flex min-w-0 items-center gap-2 lg:gap-3">
              <button type="button" aria-label={aiTwin.minimize} title={aiTwin.minimize} onClick={() => setOpen(false)} className="twin-icon-btn">
                <Icon><path d="M4 5l4 4 4-4M4 13h8" /></Icon>
              </button>
              <Avatar size={36} />
              <span className="flex min-w-0 flex-col">
                <span id="twin-title" className="truncate font-medium text-foreground">{aiTwin.title}</span>
                <span className="truncate text-sm text-muted-foreground">{aiTwin.subtitle}</span>
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1 lg:gap-2">
              <button type="button" onClick={newChat} disabled={!messages.length} className={`twin-text-btn ${messages.length ? "" : "max-lg:hidden"}`}>{aiTwin.newChat}</button>
              <button type="button" aria-label={aiTwin.close} title={aiTwin.close} onClick={() => { newChat(); setOpen(false); }} className="twin-icon-btn">
                <Icon><path d="M4 4l8 8M12 4l-8 8" /></Icon>
              </button>
            </div>
          </header>

          <div ref={threadRef} aria-live="polite" className="twin-thread no-scrollbar relative min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6">
            <div className="twin-column flex flex-col gap-3 pb-4">
              <div className="twin-card flex flex-col gap-3 p-4 lg:p-6">
                <TwinLabel />
                <p className="text-foreground">{aiTwin.intro}</p>
              </div>

              {messages.length === 0 && (
                <div className="grid gap-3 lg:grid-cols-3">
                  {aiTwin.cards.map((card) => (
                    <button key={card.question} type="button" onClick={() => ask(card.question)} className="twin-card twin-card-btn flex flex-col gap-2 p-4 text-left lg:p-6">
                      <span className="label text-brand">{card.label}</span>
                      <span className="text-foreground">{card.question}</span>
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) =>
                m.from === "you" ? (
                  <div key={m.id} ref={m.id === lastQuestionId ? lastQuestionRef : undefined} className="twin-msg flex justify-end">
                    <p className="twin-question">{m.text}</p>
                  </div>
                ) : (
                  <div key={m.id} className="twin-msg twin-card flex flex-col gap-3 p-4 lg:p-6">
                    <TwinLabel />
                    <Answer answer={m.answer} />
                  </div>
                ),
              )}

              {pending && <p className="twin-msg twin-shimmer px-1 py-2">{aiTwin.thinking}</p>}

              {messages.length > 0 && !pending && (
                <div className="twin-msg flex flex-col gap-3 pt-2">
                  <a href={emailChat(messages)} className="w-fit text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground">{aiTwin.emailChat}</a>
                  <p className="label text-muted-foreground">{aiTwin.askNext}</p>
                  <div className="flex flex-wrap gap-2">
                    {followUps.map((q) => (
                      <button key={q} type="button" onClick={() => ask(q)} className="twin-chip">{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="twin-compose shrink-0 px-4 pb-4 lg:px-6 lg:pb-6">
            <div className="twin-column twin-compose-card flex flex-col gap-3 p-3">
              <div className="twin-actions no-scrollbar flex items-center gap-2 overflow-x-auto">
                <GlowButton href={person.calendly} external>{aiTwin.bookCall}</GlowButton>
                <a href="#works" onClick={() => setOpen(false)} className="twin-action">{aiTwin.seeWorks}</a>
              </div>
              <form onSubmit={submit} className="twin-composer">
                <Sparkle />
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={aiTwin.placeholder}
                  aria-label={aiTwin.ask}
                  autoComplete="off"
                  maxLength={500}
                  className="min-w-0 flex-1 twin-input bg-transparent text-foreground placeholder:text-muted-foreground"
                />
                <button type="submit" aria-label={aiTwin.send} disabled={!draft.trim() || pending} data-active={Boolean(draft.trim())} className="twin-send"><ArrowUp /></button>
              </form>
              <p className="twin-foot text-center text-xs text-muted-foreground">
                {aiTwin.footnote} <a href={`mailto:${person.email}`} className="underline underline-offset-2 hover:text-foreground">{aiTwin.footnoteLink}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
