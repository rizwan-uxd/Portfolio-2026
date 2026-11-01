import type { CSSProperties, ReactNode } from "react";

/**
 * The three DubaiNow screens and the success sheet, ported 1:1 from
 * `ref images/mobile-flow-preview.html`.
 *
 * Everything here is authored in **phone space** — the reference's own 390×844
 * iPhone canvas, with its exact pixel offsets. `scene.tsx` owns the single transform
 * that maps that box onto the card's poster, so nothing in this file knows the
 * preview canvas exists, and the reference's coordinates transfer unaltered. That is
 * the whole reason the port is literal: a re-derived layout could not be checked
 * against the reference by reading two numbers side by side.
 *
 * Colour comes only from `--pv-*` (animations.md §6, defaults in `./tokens.ts`).
 * Nothing here animates or reads the clock — every moving part is a prop driven by
 * `isAtOrAfter` in `scene.tsx`, so the whole file composes correctly from any frame.
 */

const A = "/images/preview/dubainow";

/**
 * The reference's own transition values, kept beside the markup they belong to.
 *
 * Each is passed `motion: false` under reduced motion and resolves to `"none"`
 * (animations.md §12). That is enough here *because every one of these is driven by
 * a step boundary*, never by progress within a step — a frozen clock parked on
 * `success` lands on a composed end state (modal up, CTA released, glow off) rather
 * than on a half-applied transient. The two beats that made that true are the
 * `report-tap` and `press-cta` steps carved out in `timeline.ts`.
 */
const T = {
  screen: "transform 500ms cubic-bezier(.4,0,.2,1), opacity 500ms ease",
  glow: "box-shadow 250ms ease",
  press: "transform 100ms ease, filter 100ms ease",
  scrim: "opacity 350ms ease, background 350ms ease",
  sheet: "transform 400ms cubic-bezier(.34,1.4,.64,1)",
} as const;

const ease = (motion: boolean, value: string) => (motion ? value : "none");

/** The screen-to-screen slide, applied by `scene.tsx` to each screen layer. */
export const screenTransition = (motion: boolean) => ease(motion, T.screen);

/**
 * Scene atoms are fixed-size decorative bitmaps inside a `transform`-scaled canvas
 * that is `aria-hidden` and never the LCP candidate — `next/image`'s srcset, lazy
 * observer and layout box all cost more than they can pay back here, and its
 * `fill`/intrinsic sizing fights the hand-authored offsets above. One wrapper so the
 * rule is disabled once, with a reason, rather than at 25 call sites.
 */
function Asset({
  src,
  style,
  className,
}: {
  src: string;
  style?: CSSProperties;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${A}/${src}`} alt="" style={style} className={className} />;
}

// ── shared chrome ────────────────────────────────────────────────────────────

export function StatusBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--pv-text)",
        zIndex: 20,
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Asset src="status-cellular.svg" style={{ height: 11, width: "auto", display: "block" }} />
        <Asset src="status-wifi.svg" style={{ height: 12, width: "auto", display: "block" }} />
        <Asset src="status-battery.svg" style={{ height: 12, width: "auto", display: "block" }} />
      </div>
    </div>
  );
}

const TABS = ["Home", "Dashboard", "Happiness", "Profile"] as const;

function TabIcon({ name }: { name: (typeof TABS)[number] }) {
  if (name === "Happiness") {
    return <Asset src="tab-happiness.svg" style={{ width: 22, height: 22, display: "block" }} />;
  }
  const common = { width: 22, height: 22, display: "block" } as const;
  if (name === "Home") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" style={common}>
        <path d="M12 2.7 2.5 11h2.75v9.5h5v-6h3.5v6h5V11H21L12 2.7z" />
      </svg>
    );
  }
  if (name === "Dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" style={common}>
        <rect x="2" y="2" width="9" height="9" rx="2.2" />
        <rect x="13" y="2" width="9" height="9" rx="2.2" />
        <rect x="2" y="13" width="9" height="9" rx="2.2" />
        <rect x="13" y="13" width="9" height="9" rx="2.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={common}>
      <circle cx="12" cy="7.2" r="4.2" />
      <path d="M4 21c0-4.6 3.6-8.2 8-8.2s8 3.6 8 8.2v.3H4v-.3z" />
    </svg>
  );
}

/** `active` is null on every screen but Home, matching the reference. */
export function TabBar({ active }: { active?: (typeof TABS)[number] | null }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 78,
        background: "var(--pv-tabbar)",
        borderTop: "0.5px solid var(--pv-border)",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 8,
        zIndex: 15,
      }}
    >
      {TABS.map((tab) => (
        <div
          key={tab}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 500,
            color: tab === active ? "var(--pv-accent)" : "var(--pv-tab-inactive)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TabIcon name={tab} />
          </div>
          {tab}
        </div>
      ))}
    </div>
  );
}

function NavBar({
  back,
  title,
  trailing,
}: {
  back: ReactNode;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 88,
        paddingTop: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--pv-navbar)",
        borderBottom: "0.5px solid var(--pv-border)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 52,
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: "var(--pv-accent)",
          fontSize: 17,
        }}
      >
        {back}
      </div>
      <div style={{ marginTop: 8, fontSize: 17, fontWeight: 600, color: "var(--pv-text-2)" }}>
        {title}
      </div>
      {trailing ? (
        <div style={{ position: "absolute", right: 14, top: 52, color: "var(--pv-accent)" }}>
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

// ── screen 1: home ───────────────────────────────────────────────────────────

/** Grid order is the reference's, which is not the poster's — see `scene.tsx`. */
const TILES = [
  "bills",
  "housing",
  "residency",
  "social",
  "health",
  "driving",
  "police",
  "education",
  "travel",
  "islam",
  "donate",
  "general",
] as const;

export function HomeScreen() {
  return (
    <>
      <StatusBar />

      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          background: "var(--pv-bg)",
        }}
      >
        <Asset src="logo-dubainow.svg" style={{ height: 20, display: "block" }} />
        <div style={{ fontSize: 18, color: "var(--pv-search-glyph)" }}>&#128269;</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 112,
          left: 0,
          right: 0,
          height: 86,
          background: "var(--pv-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <div>
          <div
            style={{
              width: 250,
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "20px",
              color: "var(--pv-text)",
            }}
          >
            Contribute to provide 100 million meals
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--pv-muted)" }}>
            Powered by MBRGI
          </div>
        </div>
        <div
          style={{
            background: "var(--pv-chip-bg)",
            color: "var(--pv-accent)",
            fontSize: 15,
            fontWeight: 600,
            padding: "9px 20px",
            borderRadius: 18,
            whiteSpace: "nowrap",
          }}
        >
          Donate
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 198,
          left: 18,
          right: 18,
          height: 150,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <Asset
          src="home-hero.png"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* The reference's `.hero-card::after` scrim, which sits over the bitmap. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 368,
          left: 0,
          right: 0,
          bottom: 78,
          background: "var(--pv-bg)",
          padding: "10px 18px 0 18px",
          overflow: "hidden",
        }}
      >
        <h3
          style={{
            margin: "0 0 14px 0",
            fontSize: 18,
            fontWeight: 600,
            color: "var(--pv-text)",
          }}
        >
          Service Categories
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            rowGap: 6,
            columnGap: 0,
          }}
        >
          {TILES.map((tile) => (
            <div
              key={tile}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Asset
                src={`tile-${tile}.png`}
                style={{
                  width: 82,
                  height: "auto",
                  borderRadius: 8,
                  // Static in the reference too — the Police tile carries a standing
                  // halo marking it as the target, it is not lit on tap.
                  filter:
                    tile === "police"
                      ? "drop-shadow(0 0 0 3px var(--pv-tile-halo)) drop-shadow(0 0 6px var(--pv-tile-glow))"
                      : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <TabBar active="Home" />
    </>
  );
}

// ── screen 2: police services ────────────────────────────────────────────────

/**
 * The two live tiles, overlaid on the services bitmap.
 *
 * `police-services-bg.png` is a flat export of the whole grid that deliberately
 * leaves these two cells blank, so they can be composed from parts and lit
 * independently. The reference does exactly this; the offsets below are its own,
 * relative to `.police-content` (which starts 88px down the screen).
 */
function PoliceTile({
  x,
  glyph,
  inner,
  badge,
  labelX,
  label,
  glow,
  motion,
}: {
  x: number;
  glyph: { src: string; x: number; y: number; w: number; h: number };
  inner: { src: string; x: number; y: number; w: number; h: number };
  badge: { src: string; x: number; y: number; w: number; h: number };
  labelX: number;
  label: [string, string];
  glow?: boolean;
  motion: boolean;
}) {
  const at = (a: { x: number; y: number; w: number; h: number }) =>
    ({
      position: "absolute",
      left: a.x,
      top: a.y,
      width: a.w,
      height: a.h,
      display: "block",
      pointerEvents: "none",
    }) as CSSProperties;

  return (
    <>
      {/* Tap glow. A single `<circle fill="white">` SVG in the reference was the
          plate; both it and the grey badge disc are drawn here instead of fetched. */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: 131.04,
          width: 70.72,
          height: 70.72,
          borderRadius: "50%",
          background: "var(--pv-tile-plate)",
          boxShadow: glow ? "0 0 16px 6px var(--pv-tile-glow)" : "0 0 0 0 transparent",
          transition: ease(motion, T.glow),
        }}
      />
      <Asset src={glyph.src} style={at(glyph)} />
      <Asset src={inner.src} style={at(inner)} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: 178.86,
          width: 22.88,
          height: 22.88,
          borderRadius: "50%",
          background: "var(--pv-badge-disc)",
        }}
      />
      <Asset src={badge.src} style={at(badge)} />
      <div
        style={{
          position: "absolute",
          top: 209,
          left: labelX,
          transform: "translateX(-50%)",
          width: 80,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 600,
          lineHeight: "17px",
          color: "var(--pv-text-2)",
          opacity: 0.9,
        }}
      >
        {label[0]}
        <br />
        {label[1]}
      </div>
    </>
  );
}

export function PoliceScreen({ glow, motion }: { glow: boolean; motion: boolean }) {
  return (
    <>
      <StatusBar />
      <NavBar
        back={
          <>
            <Asset
              src="nav-back-chevron.svg"
              style={{ height: 15, width: "auto", display: "block" }}
            />
            Home
          </>
        }
        title="Police"
      />

      <div
        style={{
          position: "absolute",
          top: 88,
          left: 0,
          right: 0,
          bottom: 78,
          background: "var(--pv-surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 617, overflow: "hidden" }}
        >
          <Asset
            src="police-services-bg.png"
            style={{ position: "absolute", top: 0, left: 0, width: 390, height: "auto", display: "block" }}
          />
        </div>

        <PoliceTile
          x={206.96}
          glyph={{ src: "pf-fines-glyph.svg", x: 220.48, y: 145.6, w: 43.68, h: 40.56 }}
          inner={{ src: "pf-fines-glyph-inner.svg", x: 229.55, y: 148.28, w: 26.39, h: 25.24 }}
          badge={{ src: "pf-fines-badge-glyph.svg", x: 212.14, y: 184.06, w: 8.86, h: 12.08 }}
          labelX={242.32}
          label={["Traffic", "Fines"]}
          motion={motion}
        />
        <PoliceTile
          x={301.6}
          glyph={{ src: "pf-report-glyph.svg", x: 315.13, y: 145.6, w: 43.68, h: 40.56 }}
          inner={{ src: "pf-report-glyph-inner.svg", x: 324.19, y: 148.28, w: 26.39, h: 25.24 }}
          badge={{ src: "pf-report-badge-glyph.svg", x: 304.72, y: 186.83, w: 16.48, h: 8.67 }}
          labelX={337.02}
          label={["Report", "Accident"]}
          glow={glow}
          motion={motion}
        />
      </div>

      <TabBar />
    </>
  );
}

// ── screen 3: report accident ────────────────────────────────────────────────

export function LocationScreen({ pressed, motion }: { pressed: boolean; motion: boolean }) {
  return (
    <>
      <StatusBar />
      <NavBar
        back={
          <>
            <svg
              width="11"
              height="18"
              viewBox="0 0 11 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 1.5 1.5 9l7.5 7.5" />
            </svg>
            Back
          </>
        }
        title="Report Accident"
        trailing={
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 11a8.5 8.5 0 1 0 2.8-6.3" />
            <path d="M2.7 3.6v4.6h4.6" />
            <path d="M12 7.5v4.7l3 1.7" />
          </svg>
        }
      />

      <div
        style={{
          position: "absolute",
          top: 88,
          left: 0,
          right: 0,
          height: 430,
          overflow: "hidden",
          background: "#eef1f6",
        }}
      >
        <Asset
          src="map.png"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Asset
          src="map-disclaimer.png"
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            width: "calc(100% - 32px)",
            height: "auto",
            borderRadius: 12,
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        />
        {/* Drawn, not exported: the disclaimer bitmap leaves its icon slot blank. */}
        <div
          style={{
            position: "absolute",
            top: 34.87,
            left: 28,
            width: 29.82,
            height: 20.87,
            zIndex: 3,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 50 39" fill="none">
            <path
              d="M2.73047 38.042C1.19238 38.042 0.00292969 36.8525 0.00292969 35.335V23.5225C0.00292969 20.0566 0.700195 18.1289 2.60742 15.668L4.33008 13.4326C5.08887 9.74121 6.44238 5.86523 7.16016 4.34766C8.24707 2.03027 10.3799 0.615234 13.1074 0.287109C14.4814 0.123047 18.9727 0 24.2637 0C29.5752 0 34.0664 0.102539 35.4404 0.287109C38.168 0.65625 40.2803 2.03027 41.3877 4.34766C42.085 5.86523 43.459 9.74121 44.1973 13.4326L45.9404 15.668C47.8271 18.1289 48.5244 20.0566 48.5244 23.5225V35.335C48.5244 36.8525 47.3555 38.042 45.8174 38.042H43.3975C41.8594 38.042 40.6904 36.8525 40.6904 35.335V31.9102C36.1377 32.1973 29.5342 32.4023 24.2637 32.4023C18.9932 32.4023 12.4102 32.1973 7.85742 31.9102V35.335C7.85742 36.8525 6.66797 38.042 5.12988 38.042H2.73047ZM8.47266 11.71C8.28809 12.4688 8.5957 12.7559 9.39551 12.7148C12.7998 12.4893 16.8604 12.2842 24.2637 12.2842C31.6875 12.2842 35.748 12.4893 39.1523 12.7148C39.9316 12.7559 40.2598 12.4688 40.0752 11.71C39.542 9.47461 38.5986 6.52148 37.9014 5.35254C37.3271 4.38867 36.7529 3.97852 35.6455 3.81445C34.1074 3.56836 30.6211 3.46582 24.2637 3.46582C17.9268 3.46582 14.4404 3.60938 12.8818 3.81445C11.7744 3.95801 11.1797 4.38867 10.626 5.35254C9.94922 6.54199 8.94434 9.47461 8.47266 11.71ZM9.47754 26.8652C11.3438 26.8652 12.7793 25.4297 12.7793 23.5635C12.7793 21.6768 11.3438 20.2617 9.47754 20.2617C7.61133 20.2617 6.17578 21.6768 6.17578 23.5635C6.17578 25.4297 7.61133 26.8652 9.47754 26.8652ZM39.0498 26.8652C40.9365 26.8652 42.3516 25.4297 42.3516 23.5635C42.3516 21.6768 40.9365 20.2617 39.0498 20.2617C37.1836 20.2617 35.7686 21.6768 35.7686 23.5635C35.7686 25.4297 37.1836 26.8652 39.0498 26.8652ZM18.8496 26.0449H29.6982C31.0928 26.0449 32.0566 25.0811 32.0566 23.666C32.0566 22.2715 31.0928 21.3076 29.6982 21.3076H18.8496C17.4346 21.3076 16.4707 22.2715 16.4707 23.666C16.4707 25.0811 17.4346 26.0449 18.8496 26.0449Z"
              fill="#FF9F0A"
            />
          </svg>
        </div>
        <Asset
          src="map-pin.png"
          style={{
            position: "absolute",
            top: 150,
            left: "50%",
            transform: "translateX(-50%)",
            width: 76,
            height: "auto",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
            zIndex: 2,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 466,
          background: "var(--pv-sheet)",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -6px 20px rgba(0,0,0,0.15)",
          padding: "20px 18px",
        }}
      >
        <div
          style={{
            fontSize: 16,
            lineHeight: "21px",
            color: "var(--pv-text-2)",
            marginBottom: 16,
          }}
        >
          Please add the number of vehicle involved in accident.
        </div>
        <div
          style={{
            background: "var(--pv-bg)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 15, color: "var(--pv-text-2)" }}>Number of vehicles</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 22, color: "var(--pv-stepper-dim)" }}>&#8722;</div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "var(--pv-text-2)",
                width: 20,
                textAlign: "center",
              }}
            >
              2
            </div>
            <div style={{ fontSize: 22, color: "var(--pv-accent)" }}>&#8853;</div>
          </div>
        </div>
        <div
          style={{
            background: "var(--pv-accent)",
            color: "#fff",
            textAlign: "center",
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            filter: pressed ? "brightness(0.85)" : undefined,
            transform: pressed ? "scale(0.98)" : undefined,
            transition: ease(motion, T.press),
          }}
        >
          Report Accident
        </div>
        <div
          style={{
            marginTop: 22,
            marginBottom: 18,
            textAlign: "center",
            fontSize: 14,
            lineHeight: "19px",
            color: "var(--pv-text-2)",
          }}
        >
          Don&apos;t know who is responsible?
          <span style={{ color: "var(--pv-accent)", display: "block", marginTop: 2 }}>
            Visit nearest police station
          </span>
        </div>
      </div>
    </>
  );
}

// ── success ──────────────────────────────────────────────────────────────────

export function SuccessModal({ shown, motion }: { shown: boolean; motion: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "flex-end",
        background: shown ? "var(--pv-scrim)" : "transparent",
        opacity: shown ? 1 : 0,
        transition: ease(motion, T.scrim),
      }}
    >
      {/* Fully covered by the sheet at rest; kept because the reference has it. */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 16,
          right: 16,
          background: "var(--pv-accent)",
          color: "#fff",
          textAlign: "center",
          padding: 15,
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          opacity: 0.9,
        }}
      >
        Pay AED 1050
      </div>
      <div
        style={{
          width: "100%",
          background: "var(--pv-bg)",
          borderRadius: "20px 20px 0 0",
          padding: "28px 22px 26px 22px",
          textAlign: "center",
          transform: shown ? "translateY(0)" : "translateY(40px)",
          transition: ease(motion, T.sheet),
        }}
      >
        <Asset
          src="success-check.png"
          style={{ width: 64, height: "auto", margin: "0 auto 18px auto", display: "block" }}
        />
        <div
          style={{
            fontSize: 21,
            fontWeight: 600,
            lineHeight: "26px",
            color: "var(--pv-sheet-title)",
            marginBottom: 12,
          }}
        >
          Report Submitted Successfully
        </div>
        <div style={{ fontSize: 15, color: "var(--pv-accent)", marginBottom: 12 }}>
          REF NO: 1234567
        </div>
        <div
          style={{
            fontSize: 15,
            lineHeight: "20px",
            color: "var(--pv-sheet-desc)",
            marginBottom: 22,
          }}
        >
          Wait for the report from Police to proceed with repairing vehicle
        </div>
        <div
          style={{
            background: "var(--pv-accent)",
            color: "#fff",
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          OK
        </div>
      </div>
    </div>
  );
}
