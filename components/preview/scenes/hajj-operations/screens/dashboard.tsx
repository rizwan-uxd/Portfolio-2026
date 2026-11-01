/**
 * Frame B — the live executive dashboard. Transcribed from lines 251–556 of
 * `ref images/hajj-tile-hover.unpacked.html`, in the reference's own 1440 × 900 layout
 * space; `scene.tsx` scales it by `FRAME_UI_SCALE` and never resizes it.
 *
 * This file (Task 8) covers the shell, header, breadcrumb/drill-status bar, the six
 * regional load tiles, the Makkah map panel, the 24-hour load chart, meter
 * connectivity, unbalanced meters and interruptions — i.e. everything left of the
 * meter-load doughnut. Task 9 completes the right-hand content in the same file; see
 * the two `TASK 9` comments below for its insertion points.
 *
 * **No clock access.** The build-in — the map dolly + reveal — arrives entirely as
 * `--hj-*` custom properties set by the single writer in `scene.tsx`:
 * `--hj-mapScale`, `--hj-mapX`, `--hj-mapY`, `--hj-revealW`, `--hj-mwFillOpacity`,
 * `--hj-markerOpacity`, `--hj-mcBar`, `--hj-umBar`. `hrsRef`/`minRef`/`secRef` are the
 * countdown digits Task 9's drill-test timer writes into — accepted here only to keep
 * `scene.tsx`'s call site stable, unused until Task 9 lands. This component renders
 * once. See `scene.tsx`'s header for the full contract.
 *
 * Literal colours and sizes are the depicted product's, verbatim (see the note in
 * `data-entry.tsx`).
 *
 * **The account chip is deliberately not the reference's** (spec §8): a handle and a
 * personal name are neutralised to a generic role/handle. Do not restore them when
 * reconciling against the reference. The top-customers table (Task 9's range) is
 * neutralised there.
 *
 * **Which panel owns which variable — because the first draft got this backwards, and
 * the plan's own brief was the thing that got it wrong.**
 *
 * `--hj-revealW`, `--hj-mwFillOpacity` and `--hj-markerOpacity` all belong to the
 * **24-hour load chart**, not to the map beside it. In the reference they are, in order:
 * the width of the `mwClip` clipPath rect that wipes the three curves left to right
 * (line 371), the opacity of the single area-fill path beneath the curve (line 381), and
 * the opacity of the group holding the line's two end-point dots at x=400 (line 386).
 *
 * The **map panel is the photo alone** — 545 × 283, one `<img>`, dollying in on
 * `--hj-mapX`/`--hj-mapY`/`--hj-mapScale`. No reveal, no gradient overlay, no markers;
 * the reference has no map pins anywhere. An earlier draft moved all three chart
 * variables onto the map and invented marker dots for it out of the chart's own
 * end-point circles, leaving the chart static. That was corrected against the reference.
 * If a future reading makes the map look under-animated, that is correct — the dolly is
 * its whole animation.
 *
 * The wipe is an **SVG `clipPath` rect**, so its animated width is SVG geometry rather
 * than CSS layout and needs no exception to the transform/opacity/filter rule.
 *
 * **One deviation from the brief, noted so a reviewer doesn't chase it as a bug:**
 * the reference's Meter Connectivity/Unbalanced Meters bars are percentage-filled
 *    flex tracks (reference lines 409, 416). The brief instead gives fixed 88px/26px
 *    tracks, which matches `frame.ts`'s `mcBar`/`umBar` caps (88 and 26) exactly, so
 *    the brief's fixed-width bars are used verbatim.
 */
import type { CSSProperties } from "react";

/**
 * The right column's three cards share one surface treatment in the reference, and the
 * alert rows share four more. Naming them keeps the markup below readable at the size
 * this screen actually is, and means a surface tweak is one edit rather than eight.
 * All values are the reference's, verbatim.
 */
const CARD: CSSProperties = {
  background: "rgba(255,255,255,0.66)",
  borderRadius: 18,
  padding: "13px 14px",
  boxSizing: "border-box",
  boxShadow: "0 8px 22px rgba(16,24,40,0.05)",
};

const TIMER_CELL: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 12,
  padding: "6px 0 8px",
  textAlign: "center",
};
const TIMER_LABEL: CSSProperties = { fontSize: 10.5, color: "#7A828D" };
const TIMER_VALUE: CSSProperties = { fontSize: 27, fontWeight: 700, lineHeight: 1.15 };

const ALERT: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 12,
  padding: "8px 12px",
};
const ALERT_TAG: CSSProperties = {
  fontSize: 11,
  color: "#4A525E",
  border: "1px solid #E1E5EA",
  borderRadius: 6,
  padding: "3px 9px",
};
const ALERT_TIME: CSSProperties = { fontSize: 11, color: "#9AA1AA" };
const ALERT_BODY: CSSProperties = {
  fontSize: 12.5,
  marginTop: 6,
  lineHeight: 1.4,
  textWrap: "pretty",
};
const ALERT_BANG: CSSProperties = {
  width: 13,
  height: 13,
  borderRadius: "50%",
  background: "#E03A3A",
  color: "#FFFFFF",
  fontSize: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function DashboardScreen({
  hrsRef,
  minRef,
  secRef,
}: {
  hrsRef: React.RefObject<HTMLSpanElement | null>;
  minRef: React.RefObject<HTMLSpanElement | null>;
  secRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1440,
        height: 900,
        boxSizing: "border-box",
        padding: "22px 26px",
        background:
          "linear-gradient(118deg, #F8EEE4 0%, #F1F2F6 26%, #E9EDF4 62%, #F5EAE1 100%)",
        color: "#121821",
      }}
    >
      {/* header — reference lines 255–282 */}
      <div style={{ display: "flex", alignItems: "flex-start", height: 48 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E8792B",
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            ⚡
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#FFFFFF",
              borderRadius: 999,
              padding: "7px 18px 7px 8px",
              boxShadow: "0 5px 16px rgba(16,24,40,0.07)",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #6E7683, #2E3440)",
              }}
            />
            <span style={{ fontSize: 14.5, fontWeight: 500 }}>13th Rabi Al Awwal, 1447</span>
            <span style={{ width: 1, height: 16, background: "rgba(16,24,40,0.14)" }} />
            <span style={{ fontSize: 14.5, fontWeight: 500 }}>36 ºc</span>
          </div>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "0 0 12px 12px",
              padding: "4px 16px 6px",
              fontSize: 12.5,
              color: "#4A525E",
              boxShadow: "0 6px 14px rgba(16,24,40,0.06)",
            }}
          >
            Hajj starts in <span style={{ fontWeight: 700, color: "#121821" }}>35 Days</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "#FFFFFF",
              borderRadius: 999,
              padding: "7px 12px",
              boxShadow: "0 3px 10px rgba(16,24,40,0.05)",
            }}
          >
            <span style={{ fontSize: 13, color: "#3A424E" }}>عربي</span>
            <div style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid #6B7480" }} />
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 10px rgba(16,24,40,0.05)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "4px 4px 2px 2px",
                border: "1.6px solid #3A424E",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "#FFFFFF",
              borderRadius: 999,
              padding: "5px 12px 5px 5px",
              boxShadow: "0 3px 10px rgba(16,24,40,0.05)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#E4E8EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#A9B1BC" }} />
            </div>
            <div>
              {/* neutralised — spec §8: the reference names an individual here */}
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.15 }}>Operations lead</div>
              <div style={{ fontSize: 11, color: "#7A828D", lineHeight: 1.15 }}>@ops</div>
            </div>
            <span style={{ fontSize: 10, color: "#7A828D" }}>▾</span>
          </div>
        </div>
      </div>

      {/* breadcrumb + drill status — reference lines 285–299 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 40,
          marginTop: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              border: "1.5px solid #2B323C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 9, height: 9, border: "1.5px solid #2B323C", borderRadius: 2 }} />
          </div>
          <span style={{ textDecoration: "underline", color: "#2B323C" }}>Dashboard</span>
          <span style={{ color: "#A6ADB6" }}>›</span>
          <span style={{ fontWeight: 700 }}>1st Drill Test</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#FFFFFF",
            borderRadius: 999,
            padding: "6px 6px 6px 16px",
            boxShadow: "0 4px 12px rgba(16,24,40,0.06)",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2FA84F" }} />
          <span style={{ fontSize: 13, color: "#2B323C" }}>1st Drill test active – awaiting first hour data</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#FDF3E2",
              borderRadius: 8,
              padding: "5px 9px",
              fontSize: 10.5,
              color: "#8A6A21",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: "#E0A32B" }}>⏳</span>
            <span>
              Next update in
              <br />
              11 mins (16:00)
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              border: "1.5px solid #E8792B",
              color: "#E8792B",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <span>⟳</span>Refresh
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1.5px solid #E8792B",
              color: "#E8792B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
            }}
          >
            ⤓
          </div>
        </div>
      </div>

      {/* body row — reference line 301 */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, alignItems: "flex-start" }}>
        {/* ========== LEFT COLUMN — reference lines 304–474 ========== */}
        <div style={{ width: 1032, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* region strip + map + 24h load card — reference lines 306–398 */}
          <div
            style={{
              background: "rgba(255,255,255,0.60)",
              borderRadius: 18,
              padding: 10,
              boxSizing: "border-box",
              boxShadow: "0 8px 22px rgba(16,24,40,0.05)",
            }}
          >
            {/* region strip — reference lines 308–335 */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, display: "flex", background: "#FFFFFF", borderRadius: 14, overflow: "hidden" }}>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "11px 10px",
                    background: "linear-gradient(180deg, #FFF9F3, #FDEFE1)",
                    borderBottom: "2.5px solid #E8792B",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: "linear-gradient(160deg, #F6C99A, #E8792B)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Makkah City</div>
                    <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>1,905 MW</div>
                    <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: "linear-gradient(160deg, #4A5260, #14171C)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Haram Maki</div>
                    <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>98 MW</div>
                    <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "7px 7px 4px 4px",
                      background: "linear-gradient(160deg, #F6D3AE, #E8A15B)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Mina</div>
                    <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>456 MW</div>
                    <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: "linear-gradient(160deg, #E7E9ED, #BFC5CE)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Arafat</div>
                    <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>100 MW</div>
                    <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: "linear-gradient(160deg, #EDEFF2, #C9CFD8)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Muzdalifah</div>
                    <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>100 MW</div>
                    <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 208,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "11px 12px",
                  background: "#FFFFFF",
                  borderRadius: 14,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: "linear-gradient(160deg, #BFE3C6, #2E8A55)",
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Madinah City</div>
                  <div style={{ fontSize: 11.5, color: "#4A525E", marginTop: 2 }}>1,100 MW</div>
                  <div style={{ fontSize: 10.5, color: "#E8792B", marginTop: 2 }}>↗ 0.5% from 1446</div>
                </div>
              </div>
            </div>

            {/* map + 24h load graph — reference lines 338–397 */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {/* Makkah map panel — reference lines 339–341: photo only, no reveal,
                  gradient or markers. */}
              <div style={{ position: "relative", width: 545, height: 283, borderRadius: 14, overflow: "hidden", background: "#F4F5F7" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/preview/hajj/makkah-aerial.png"
                  alt=""
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transformOrigin: "46% 58%",
                    transform:
                      "translate(var(--hj-mapX, 0px), var(--hj-mapY, 0px)) scale(var(--hj-mapScale, 1))",
                  }}
                />
              </div>

              {/* 24-hour load chart card — reference lines 342–396. Carries the
                  reveal clip, fill opacity and end-point marker opacity. */}
              <div style={{ flex: 1, background: "#FFFFFF", borderRadius: 14, padding: "12px 14px", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>Makkah</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 2 }}>
                      <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>1,860</span>
                      <span style={{ fontSize: 12, color: "#4A525E" }}>MW</span>
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: 6,
                        fontSize: 11,
                        color: "#C9611A",
                        background: "#FDEEE0",
                        borderRadius: 6,
                        padding: "3px 8px",
                      }}
                    >
                      ↗ 0.5% than last year
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 10.5, color: "#4A525E" }}>
                      <span>
                        <span
                          style={{
                            display: "inline-block",
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#F0913F",
                            marginRight: 5,
                          }}
                        />
                        1447 Hijri
                      </span>
                      <span>
                        <span
                          style={{
                            display: "inline-block",
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#C3C9D1",
                            marginRight: 5,
                          }}
                        />
                        1446 Hijri
                      </span>
                      <span
                        style={{
                          color: "#C9611A",
                          background: "#FDF3E2",
                          borderRadius: 5,
                          padding: "2px 5px",
                          marginTop: 2,
                        }}
                      >
                        ⚠ 52 Meters
                      </span>
                    </div>
                    <div style={{ border: "1px solid #F3C7C4", borderRadius: 8, padding: "5px 8px" }}>
                      <div style={{ fontSize: 10.5, color: "#D9534F" }}>Max</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                        1,980 <span style={{ fontSize: 9.5, fontWeight: 400 }}>MW</span>
                      </div>
                      <div style={{ fontSize: 9.5, color: "#7A828D", marginTop: 2 }}>at 05:00</div>
                    </div>
                    <div style={{ border: "1px solid #C7E4CE", borderRadius: 8, padding: "5px 8px" }}>
                      <div style={{ fontSize: 10.5, color: "#2E8A55" }}>Min</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                        1,810 <span style={{ fontSize: 9.5, fontWeight: 400 }}>MW</span>
                      </div>
                      <div style={{ fontSize: 9.5, color: "#7A828D", marginTop: 2 }}>at 14:00</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <div
                    style={{
                      width: 34,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      fontSize: 10,
                      color: "#8A929B",
                      height: 152,
                      textAlign: "right",
                    }}
                  >
                    <span>2,000</span>
                    <span>1,950</span>
                    <span>1,900</span>
                    <span>1,850</span>
                    <span>1,800</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <svg
                      viewBox="0 0 404 170"
                      preserveAspectRatio="none"
                      style={{ display: "block", width: "100%", height: 152, overflow: "visible" }}
                    >
                      <defs>
                        <linearGradient id="mwFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#F0913F" stopOpacity="0.30" />
                          <stop offset="1" stopColor="#F0913F" stopOpacity="0" />
                        </linearGradient>
                        <clipPath id="mwClip">
                          <rect x="-2" y="-40" height="260" style={{ width: "var(--hj-revealW, 0px)" }} />
                        </clipPath>
                      </defs>
                      <g stroke="#E9EBEF" strokeWidth="1" vectorEffect="non-scaling-stroke">
                        <line x1="0" y1="0" x2="404" y2="0" />
                        <line x1="0" y1="42.5" x2="404" y2="42.5" />
                        <line x1="0" y1="85" x2="404" y2="85" />
                        <line x1="0" y1="127.5" x2="404" y2="127.5" />
                        <line x1="0" y1="170" x2="404" y2="170" />
                      </g>
                      <g clipPath="url(#mwClip)">
                        <path
                          d="M0,170 C10,168 18,150 25,119 C33,80 42,17 50,17 C58,17 70,40 83,59 C96,79 106,100 117,104 C137,110 150,106 167,106 C180,106 192,108 200,112 C210,120 216,138 225,144 C234,151 242,163 250,163 C259,163 266,140 275,119 C288,90 302,53 317,53 C328,53 342,70 350,85 C359,101 366,122 375,126 C384,129 392,124 400,119 L400,170 L0,170 Z"
                          fill="url(#mwFill)"
                          style={{ opacity: "var(--hj-mwFillOpacity, 0)" }}
                        />
                        <path
                          d="M0,170 C15,165 35,95 50,85 C62,78 75,98 83,104 C110,118 145,116 200,117 C218,118 235,145 250,157 C262,164 272,120 290,95 C300,82 310,85 317,85 C330,85 342,105 350,110 C360,116 368,127 375,127 C385,127 393,125 400,123"
                          fill="none"
                          stroke="#C3C9D1"
                          strokeWidth="1.8"
                          strokeDasharray="6 5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d="M0,170 C10,168 18,150 25,119 C33,80 42,17 50,17 C58,17 70,40 83,59 C96,79 106,100 117,104 C137,110 150,106 167,106 C180,106 192,108 200,112 C210,120 216,138 225,144 C234,151 242,163 250,163 C259,163 266,140 275,119 C288,90 302,53 317,53 C328,53 342,70 350,85 C359,101 366,122 375,126 C384,129 392,124 400,119"
                          fill="none"
                          stroke="#F0913F"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                      <line x1="400" y1="-6" x2="400" y2="170" stroke="#C3C9D1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <g style={{ opacity: "var(--hj-markerOpacity, 0)" }}>
                        <circle cx="400" cy="127" r="3.4" fill="#C3C9D1" />
                        <circle cx="400" cy="119" r="5.4" fill="#F0913F" stroke="#FFFFFF" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
                      </g>
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, color: "#8A929B" }}>
                      <span>00:00</span>
                      <span>03:00</span>
                      <span>06:00</span>
                      <span>09:00</span>
                      <span>12:00</span>
                      <span>15:00</span>
                      <span>18:00</span>
                      <span>21:00</span>
                      <span style={{ fontWeight: 700, color: "#2B323C" }}>00:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* critical locations card — reference lines 401–473 */}
          <div
            style={{
              background: "rgba(255,255,255,0.60)",
              borderRadius: 18,
              padding: 14,
              boxSizing: "border-box",
              boxShadow: "0 8px 22px rgba(16,24,40,0.05)",
            }}
          >
            <div style={{ fontSize: 21, fontWeight: 700 }}>
              Critical locations-- Mina | Arafat{" "} | Muzdalifah
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <div style={{ width: 330, display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Meter Connectivity — reference lines 405–413 */}
                <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Meter Connectivity</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>99%</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 9,
                      fontSize: 9.5,
                      letterSpacing: ".05em",
                      color: "#8A929B",
                    }}
                  >
                    <span>ONLINE</span>
                    <span>OFFLINE</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 5, alignItems: "center" }}>
                    <div style={{ width: 88, height: 8, borderRadius: 4, background: "rgba(16,24,40,0.08)" }}>
                      <div
                        style={{
                          width: "var(--hj-mcBar, 0px)",
                          height: 8,
                          borderRadius: 4,
                          background: "#2E9E4F",
                        }}
                      />
                    </div>
                    <div style={{ width: 26, height: 9, borderRadius: 999, background: "#D8DDE4" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: 12 }}>
                    <span>
                      <span style={{ color: "#2E8A55", fontWeight: 500 }}>11097</span>
                      <span style={{ color: "#7A828D" }}>/11212</span>
                    </span>
                    <span style={{ fontWeight: 500 }}>121</span>
                  </div>
                </div>

                {/* Unbalanced Meters — reference lines 414–421 */}
                <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Unbalanced Meters</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>230</div>
                  </div>
                  <div style={{ width: 26, height: 8, borderRadius: 4, background: "rgba(16,24,40,0.08)", marginTop: 11 }}>
                    <div
                      style={{
                        width: "var(--hj-umBar, 0px)",
                        height: 8,
                        borderRadius: 4,
                        background: "#E8792B",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 9, fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 2.5, height: 12, background: "#E8792B" }} />
                      <span style={{ color: "#4A525E" }}>One Phase</span>
                      <span style={{ color: "#C9611A", fontWeight: 500 }}>80</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 2.5, height: 12, background: "#C3C9D1" }} />
                      <span style={{ color: "#4A525E" }}>Two Phase</span>
                      <span style={{ color: "#7A828D", fontWeight: 500 }}>150</span>
                    </span>
                  </div>
                </div>

                {/* Interruptions — reference lines 422–429 */}
                <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Interruptions</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>14</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 9,
                      fontSize: 9.5,
                      letterSpacing: ".05em",
                      color: "#8A929B",
                    }}
                  >
                    <span>GENERAL</span>
                    <span>INTERNAL</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12, color: "#4A525E" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      LV{" "}
                      <span style={{ border: "1px solid #E1E5EA", borderRadius: 5, padding: "2px 7px", color: "#121821" }}>
                        0
                      </span>{" "}
                      <span style={{ color: "#121821" }}>0</span> MV
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      LV{" "}
                      <span style={{ border: "1px solid #E1E5EA", borderRadius: 5, padding: "2px 7px", color: "#121821" }}>
                        15
                      </span>{" "}
                      <span style={{ color: "#121821" }}>0</span> MV
                    </span>
                  </div>
                </div>
              </div>

              {/* Meter Load & Customer Consumption — reference lines 432–471 */}
              <div style={{ flex: 1, background: "#FFFFFF", borderRadius: 14, padding: 14, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    Meter Load &amp; Customer Consumption
                  </div>
                  <div style={{ fontSize: 10.5, color: "#8A929B" }}>
                    ⓘ Click a segment to view top customers in each group
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Meter load</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: "#4A525E" }}>
                    {[
                      ["#F6B98B", "Low (<30%)"],
                      ["#F0821F", "Optimum (30 -80%)"],
                      ["#A8481B", "Risk (81-100%)"],
                      ["#E03A3A", "Overload (> 100%)"],
                    ].map(([colour, label]) => (
                      <span key={label}>
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: colour,
                            marginRight: 5,
                          }}
                        />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
                  <div style={{ position: "relative", flex: 1, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* One shared clockwise sweep, four segments. Each segment's own
                        `rotate()` is where its arc starts; the dash arrays come from
                        `frame.ts`'s SEGS, whose circumferences are computed from these
                        exact radii (68 and 66) — change a radius and the dash lengths
                        stop matching their arcs. */}
                    <svg viewBox="0 0 200 200" style={{ width: 186, height: 186, display: "block" }}>
                      <g fill="none" strokeLinecap="butt">
                        <circle cx="100" cy="100" r="68" stroke="#F6B98B" strokeWidth="25" transform="rotate(-158 100 100)" style={{ strokeDasharray: "var(--hj-dLow, 0 999)" }} />
                        <circle cx="100" cy="100" r="66" stroke="#F0821F" strokeWidth="29" transform="rotate(-57 100 100)" style={{ strokeDasharray: "var(--hj-dOpt, 0 999)" }} />
                        <circle cx="100" cy="100" r="66" stroke="#A8481B" strokeWidth="29" transform="rotate(166 100 100)" style={{ strokeDasharray: "var(--hj-dRisk, 0 999)" }} />
                        <circle cx="100" cy="100" r="66" stroke="#E03A3A" strokeWidth="29" transform="rotate(187 100 100)" style={{ strokeDasharray: "var(--hj-dOver, 0 999)" }} />
                      </g>
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: "var(--hj-dLabelOpacity, 0)",
                      }}
                    >
                      <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1 }}>29%</div>
                      <div style={{ fontSize: 11, color: "#4A525E", marginTop: 3, lineHeight: 1.2, textAlign: "center" }}>
                        Low
                        <br />
                        Meters
                      </div>
                    </div>
                  </div>

                  {/* Top customers. The five organisation names are neutralised to
                      generic sector labels (spec §8); the meter counts are the
                      reference's, verbatim. Do not restore the originals. */}
                  <div style={{ width: 268, border: "1px solid #EDEFF2", borderRadius: 12, padding: "10px 12px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 500 }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F6B98B" }} />
                      Top customers (Low)
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingBottom: 6, borderBottom: "1px solid #EDEFF2", fontSize: 10.5, color: "#8A929B" }}>
                      <span>Health</span>
                      <span>Meters</span>
                    </div>
                    {[
                      ["Site services authority", "3100"],
                      ["Public safety agency", "230"],
                      ["Facilities operator", "120"],
                      ["Pilgrimage authority", "40"],
                      ["Telecom operator", "40"],
                    ].map(([name, meters], index, rows) => (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "7px 0",
                          borderBottom: index === rows.length - 1 ? undefined : "1px solid #F2F4F6",
                          fontSize: 12,
                        }}
                      >
                        <span>{name}</span>
                        <span>{meters}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN — reference lines 477–554 ========== */}
        <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 11 }}>
          {/* Drill-test countdown */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>
                1<sup>st</sup> Drill test ends in
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#2E8A55", background: "#E8F6EA", borderRadius: 999, padding: "4px 10px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2FA84F" }} />
                Ongoing
              </div>
            </div>

            {/* Only the digits tick; the labels and boxes are static. The three refs
                are written by `scene.tsx`'s frame callback — they are the four values
                a custom property cannot carry. Their initial text is the *final*
                value, so a server render or the frame before the first write shows a
                settled clock rather than zeros. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10 }}>
              <div style={TIMER_CELL}>
                <div style={TIMER_LABEL}>Days</div>
                <div style={TIMER_VALUE}>00</div>
              </div>
              <div style={TIMER_CELL}>
                <div style={TIMER_LABEL}>Hours</div>
                <div style={TIMER_VALUE}>
                  <span ref={hrsRef}>01</span>
                </div>
              </div>
              <div style={TIMER_CELL}>
                <div style={TIMER_LABEL}>Minutes</div>
                <div style={TIMER_VALUE}>
                  <span ref={minRef}>15</span>
                </div>
              </div>
              <div style={TIMER_CELL}>
                <div style={TIMER_LABEL}>Seconds</div>
                <div style={TIMER_VALUE}>
                  <span ref={secRef}>59</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                2<sup>nd</sup> Drill test
              </div>
              <div style={{ fontSize: 11.5, color: "#7A828D", background: "#EDEFF2", borderRadius: 999, padding: "4px 10px" }}>
                Not Started
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#4A525E", marginTop: 6 }}>Starts on 01/12/1447</div>
          </div>

          {/* Safety Score and Readiness Index */}
          <div style={CARD}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Safety Score and Readiness Index</div>
            <div style={{ display: "flex", gap: 4, background: "#EEF0F4", borderRadius: 999, padding: 4, marginTop: 10 }}>
              <div style={{ flex: 1, textAlign: "center", fontSize: 12.5, fontWeight: 700, color: "#FFFFFF", background: "#E8792B", borderRadius: 999, padding: "7px 0" }}>
                Safety Score
              </div>
              <div style={{ flex: 1, textAlign: "center", fontSize: 12.5, color: "#4A525E", padding: "7px 0" }}>
                Readiness Index
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "10px 14px", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* The gauge arc sweeps on its own dash variable; the score text
                      follows it in on a separate one, so the number never appears
                      beside an empty ring. */}
                  <svg viewBox="0 0 44 44" style={{ width: 34, height: 34, display: "block" }}>
                    <circle cx="22" cy="22" r="17" fill="none" stroke="#EDEFF2" strokeWidth="4.5" />
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="none"
                      stroke="#35B45B"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      transform="rotate(-84 22 22)"
                      style={{ strokeDasharray: "var(--hj-safDash, 0 999)" }}
                    />
                  </svg>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, opacity: "var(--hj-safTextOpacity, 0)" }}>
                    <span style={{ fontSize: 26, fontWeight: 700 }}>9.8</span>
                    <span style={{ fontSize: 13, color: "#7A828D" }}>/10</span>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: "#2E8A55", background: "#E8F6EA", borderRadius: 6, padding: "4px 10px" }}>
                  Good
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12.5 }}>
                {[
                  ["Stations on overload", "8"],
                  ["Safety Incidents", "0"],
                  ["Avg Outage handling time", "6 m 15 s"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #F2F4F6" }}>
                    <span style={{ color: "#4A525E" }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Risks & Alerts. Note the two variables land on the *middle* card
              only — the reference fades in and highlights the Projects alert, not the
              whole feed. The other two rows are always present. */}
          <div style={CARD}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Latest Risks &amp; Alerts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              <div style={ALERT}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={ALERT_TAG}>Load</span>
                  <span style={ALERT_TIME}>13 hours ago</span>
                </div>
                <div style={ALERT_BODY}>
                  Meter 42214 is now communicating with the smart network.
                </div>
              </div>

              <div style={{ ...ALERT, position: "relative", opacity: "var(--hj-alertOpacity, 0)" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 12,
                    background: "rgba(47,168,79,0.10)",
                    boxShadow: "inset 0 0 0 1.5px rgba(47,168,79,0.45)",
                    pointerEvents: "none",
                    opacity: "var(--hj-alertHighlight, 0)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={ALERT_TAG}>Projects</span>
                    <span style={ALERT_BANG}>!</span>
                  </span>
                  <span style={ALERT_TIME}>13 hours ago</span>
                </div>
                <div style={ALERT_BODY}>
                  Project &apos;Al-Noor Tent City&apos; is now moved to delayed.
                </div>
              </div>

              <div style={ALERT}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={ALERT_TAG}>Load</span>
                    <span style={ALERT_BANG}>!</span>
                  </span>
                  <span style={ALERT_TIME}>11 hours ago</span>
                </div>
                <div style={ALERT_BODY}>Meter 48392 is offline.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
