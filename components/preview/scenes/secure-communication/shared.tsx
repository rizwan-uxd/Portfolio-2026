import type { CSSProperties, ReactNode } from "react";

/**
 * Data + subcomponents shared by every SecureLink-shaped scene — currently
 * `scenes/secure-communication/scene.tsx` (featured, 21:9, the original 1:1 port of
 * `ref images/securelink-preview.html`) and `scenes/secure-communication-grid/scene.tsx`
 * (grid, 4:3, the same product duplicated onto a smaller canvas, 2026-08-01).
 *
 * Split out so the second scene reuses this content and markup instead of
 * copy-pasting it — a duplicate card should share one source of truth for "what
 * SecureLink's UI looks like," not fork it. Each scene still owns its own layout
 * constants, column widths and `timeline.ts`, because those are genuinely different
 * per canvas.
 */

export const fontStack = "'Segoe UI', Arial, sans-serif";

export type ChipVariant = "progress" | "upcoming" | null;

export type CardData = {
  id: string;
  title: string;
  time: string;
  desc: string;
  person: string;
  chip: { variant: ChipVariant; label: string } | null;
};

export const CARDS: CardData[] = [
  {
    id: "sprint",
    title: "Sprint backlog meeting",
    time: "Tomorrow, 4:00 PM - 5:00 PM",
    desc: "To review and refine product backlog items for the upcoming sprint.",
    person: "Aamal",
    chip: { variant: "upcoming", label: "Upcoming" },
  },
  {
    id: "standup",
    title: "Daily standup",
    time: "Today, 4:00 PM - 5:00 PM",
    desc: "To synchronize team activities and progress toward sprint goals.",
    person: "You",
    chip: { variant: "progress", label: "In progress" },
  },
  {
    id: "roadmap",
    title: "Product road map",
    time: "15 Jul, 4:00 PM - 5:00 PM",
    desc: "Prioritize features and initiatives based on strategic objectives.",
    person: "Ajmal",
    chip: null,
  },
];

export type ParticipantData = { name: string; role: string };

export type DetailData = {
  title: string;
  time: string;
  createdBy: string;
  desc: string;
  participantCount: number;
  participants: ParticipantData[];
};

export const SPRINT_DETAIL: DetailData = {
  title: "Sprint backlog meeting",
  time: "Tomorrow, 4:00 PM - 5:00 PM",
  createdBy: "Created by: Aamal on 11 June 2024",
  desc: "To review and refine product backlog items for the upcoming sprint.",
  participantCount: 3,
  participants: [
    { name: "Aamal", role: "Owner" },
    { name: "Muhammad Yasir (You)", role: "Participant" },
    { name: "Abdullah Khan", role: "Participant" },
  ],
};

export const STANDUP_DETAIL: DetailData = {
  title: "Daily standup",
  time: "Today, 4:00 PM - 5:00 PM",
  createdBy: "Created by: You on 12 June 2024",
  desc: "To synchronize team activities and progress toward sprint goals.",
  participantCount: 5,
  participants: [
    { name: "Muhammad Yasir (You)", role: "Participant" },
    { name: "Ahmad Al Khasmi", role: "Participant" },
    { name: "Muhammad Nabi", role: "Owner" },
  ],
};

export type MessageData = {
  step: string;
  dir: "in" | "out";
  name?: string;
  text: ReactNode;
  time: string;
};

/** All 7, in order — the featured scene uses every one; the grid scene uses a subset. */
export const MESSAGES: MessageData[] = [
  { step: "m1", dir: "in", name: "Ahmad Al Khasmi", text: "Hi Good morning", time: "4:01 PM" },
  { step: "m2", dir: "out", text: "Good morning all", time: "4:01 PM" },
  { step: "m3", dir: "in", name: "Abdullah Khan", text: "GM Team", time: "4:02 PM" },
  {
    step: "m4",
    dir: "in",
    name: "Abdullah Khan",
    text: "Can we start the standup?",
    time: "4:03 PM",
  },
  {
    step: "m5",
    dir: "out",
    text: (
      <>
        Waiting for <span style={{ color: "var(--pv-upcoming)" }}>Mike</span> to join
      </>
    ),
    time: "4:03 PM",
  },
  { step: "m6", dir: "in", name: "Mike", text: "Hi All", time: "4:04 PM" },
  { step: "m7", dir: "out", text: "Let's start the meeting!", time: "4:05 PM" },
];

export function ListCard({
  card,
  selected,
  settled,
  last,
}: {
  card: CardData;
  selected: boolean;
  settled: string;
  last: boolean;
}) {
  return (
    <div
      style={{
        background: selected ? "var(--pv-selected)" : "var(--pv-surface)",
        borderRadius: 8,
        padding: 10,
        marginBottom: last ? 0 : 8,
        transition: settled,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pv-text)", marginBottom: 2 }}>
        {card.title}
      </div>
      <div style={{ fontSize: 10, color: "var(--pv-text-2)", marginBottom: 5 }}>
        {card.time}
      </div>
      <div
        style={{
          fontSize: 9.5,
          lineHeight: "12px",
          color: "var(--pv-muted)",
          marginBottom: 8,
        }}
      >
        {card.desc}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "var(--pv-text)",
            fontSize: 8.5,
            whiteSpace: "nowrap",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--pv-avatar)",
              flexShrink: 0,
            }}
          />
          {card.person}
        </div>
        {card.chip && (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: 999,
              fontSize: 8,
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
              background:
                card.chip.variant === "progress" ? "var(--pv-ok-bg)" : "var(--pv-upcoming-bg)",
              color: card.chip.variant === "progress" ? "var(--pv-ok)" : "var(--pv-upcoming)",
            }}
          >
            {card.chip.label}
          </span>
        )}
      </div>
    </div>
  );
}

export function DetailPanel({
  data,
  visible,
  settled,
  maxParticipants,
}: {
  data: DetailData;
  visible: boolean;
  settled: string;
  /** Caps rendered rows without changing the declared count label — the reference
   *  itself already does this (standup declares "(5)" but lists 3), so a grid canvas
   *  showing fewer rows than `participantCount` is the same pattern, not a new one. */
  maxParticipants?: number;
}) {
  const participants = maxParticipants
    ? data.participants.slice(0, maxParticipants)
    : data.participants;

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 14,
        right: 14,
        opacity: visible ? 1 : 0,
        transition: settled,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--pv-text-2)", marginBottom: 5 }}>
        {data.title}
      </div>
      <div style={{ fontSize: 10, color: "var(--pv-text-2)", marginBottom: 5 }}>{data.time}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 9,
          color: "var(--pv-muted)",
          marginBottom: 9,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "var(--pv-avatar)",
            flexShrink: 0,
          }}
        />
        {data.createdBy}
      </div>
      <div
        style={{
          fontSize: 9.5,
          lineHeight: "12px",
          color: "var(--pv-muted)",
          marginBottom: 12,
        }}
      >
        {data.desc}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--pv-text)", marginBottom: 8 }}>
        Participant list ({data.participantCount})
      </div>
      {participants.map((participant) => (
        <div
          key={participant.name}
          style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--pv-avatar)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--pv-text)" }}>
              {participant.name}
            </div>
            <div style={{ fontSize: 9, color: "var(--pv-muted)" }}>{participant.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Bubble({
  message,
  visible,
  maxWidth = 230,
}: {
  message: MessageData;
  visible: boolean;
  maxWidth?: number;
}) {
  const out = message.dir === "out";
  const style: CSSProperties = {
    display: "flex",
    gap: 8,
    justifyContent: out ? "flex-end" : "flex-start",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(8px)",
    transition: "opacity 300ms ease, transform 300ms ease",
  };

  return (
    <div style={style}>
      {!out && (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--pv-avatar)",
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          background: out ? "var(--pv-bubble-out)" : "var(--pv-bubble-in)",
          borderRadius: out ? "7px 2px 7px 7px" : "2px 7px 7px 7px",
          padding: "5px 9px",
          maxWidth,
        }}
      >
        {!out && message.name && (
          <div
            style={{
              color: "var(--pv-accent-name)",
              fontSize: 9,
              fontWeight: 600,
              marginBottom: 1,
            }}
          >
            {message.name}
          </div>
        )}
        <div style={{ color: "var(--pv-text-2)", fontSize: 11, lineHeight: "13px" }}>
          {message.text}
        </div>
        <div style={{ color: "var(--pv-muted)", fontSize: 8, textAlign: "right", marginTop: 2 }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}
