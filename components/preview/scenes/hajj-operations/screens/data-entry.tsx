/**
 * Frame A — the project-manager data entry platform. Transcribed from lines 82–242 of
 * `ref images/hajj-tile-hover.unpacked.html`, in the reference's own 1440 × 900 layout
 * space; `scene.tsx` scales it by `FRAME_UI_SCALE` and never resizes it.
 *
 * **No clock access.** Every animated value arrives as a `--hj-*` custom property set
 * on the scene root by the single writer in `scene.tsx`, or — for the button's label,
 * the one thing a custom property cannot carry — through `btnLabelRef`. This component
 * renders once. See `scene.tsx`'s header for the contract.
 *
 * Literal colours and sizes here are the depicted product's, copied verbatim, exactly
 * as `scenes/dubainow/screens.tsx` does. The `--pv-*`-only rule governs the scene's own
 * chrome, not the product it is showing.
 *
 * **Two strings are deliberately not the reference's** (spec §8): the greeting and the
 * project-manager field are neutralised. Do not restore the originals from the
 * reference when reconciling a diff — they name a real individual.
 */
export function DataEntryScreen({
  btnLabelRef,
}: {
  btnLabelRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1440,
        height: 900,
        background:
          "linear-gradient(120deg, #F1EDE8 0%, #E9ECF2 55%, #E3E7EF 100%)",
        color: "#121821",
      }}
    >
      {/* ── left column · reference lines 83–177 ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1000,
          height: 900,
          padding: "26px 30px 0 30px",
          boxSizing: "border-box",
        }}
      >
        {/* header — reference lines 84–109 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E8792B",
              fontSize: 27,
              lineHeight: 1,
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 15, color: "#3A424E" }}>عربي</span>
            <svg width="21" height="21" viewBox="0 0 21 21" style={{ display: "block" }}>
              <circle cx="10.5" cy="10.5" r="9.2" fill="none" stroke="#5A626D" strokeWidth="1.3" />
              <ellipse cx="10.5" cy="10.5" rx="4.2" ry="9.2" fill="none" stroke="#5A626D" strokeWidth="1.3" />
              <line x1="1.3" y1="10.5" x2="19.7" y2="10.5" stroke="#5A626D" strokeWidth="1.3" />
              <line x1="3" y1="5.6" x2="18" y2="5.6" stroke="#5A626D" strokeWidth="1.1" />
              <line x1="3" y1="15.4" x2="18" y2="15.4" stroke="#5A626D" strokeWidth="1.1" />
            </svg>
            <div
              style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(16,24,40,0.06)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 18 18" style={{ display: "block" }}>
                <path
                  d="M4.2 12.4V8.2a4.8 4.8 0 0 1 9.6 0v4.2l1.1 1.6H3.1z"
                  fill="none"
                  stroke="#3A424E"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.2 15.1a1.9 1.9 0 0 0 3.6 0"
                  fill="none"
                  stroke="#3A424E"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  right: 7,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#E8433A",
                  border: "1.6px solid #FFFFFF",
                }}
              />
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(16,24,40,0.06)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 18 18" style={{ display: "block" }}>
                <circle cx="9" cy="6.2" r="3.1" fill="#3A424E" />
                <path d="M2.9 15.6c0-3.2 2.7-5 6.1-5s6.1 1.8 6.1 5z" fill="#3A424E" />
              </svg>
            </div>
          </div>
        </div>

        {/* last-updated line — reference line 110 */}
        <div style={{ textAlign: "right", fontSize: 12, color: "#6B7480", marginTop: 16 }}>
          Last updated 7/11/1447{" "}{" "}12:00 AM
        </div>

        {/* overview card — reference lines 112–133 */}
        <div
          style={{
            marginTop: 12,
            height: 104,
            borderRadius: 16,
            background: "linear-gradient(90deg, #FDF3E8 0%, #F8F5F1 38%, #F1F3F6 100%)",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 6px 18px rgba(16,24,40,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: 300, padding: "0 26px" }}>
            <div style={{ fontSize: 13, color: "#6B7480" }}>Projects overview</div>
            {/* neutralised — spec §8: the reference names an individual here */}
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>Welcome back!</div>
          </div>
          <div style={{ width: 1, height: 58, background: "rgba(16,24,40,0.10)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 26px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/preview/hajj/avatar.png"
              alt=""
              style={{ width: 42, height: 42, borderRadius: "50%", display: "block", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
                4th Rabi Al Awwal 1447 AH
              </div>
              <div style={{ fontSize: 14, color: "#7A828D", marginTop: 3 }}>36 °c</div>
            </div>
          </div>
          <div style={{ width: 1, height: 58, background: "rgba(16,24,40,0.10)", marginLeft: "auto" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20, paddingLeft: 24 }}>
            <div>
              <div style={{ fontSize: 14, color: "#7A828D", whiteSpace: "nowrap" }}>Days to Hajj</div>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.05 }}>01</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/preview/hajj/kaaba.png"
              alt=""
              style={{
                width: 146,
                height: 104,
                display: "block",
                objectFit: "cover",
                objectPosition: "50% 100%",
              }}
            />
          </div>
        </div>

        {/* reviews / project table card — reference lines 135–176 */}
        <div
          style={{
            marginTop: 14,
            background: "rgba(255,255,255,0.62)",
            borderRadius: 18,
            padding: "18px 20px",
            boxShadow: "0 8px 22px rgba(16,24,40,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 34,
              borderBottom: "1px solid rgba(16,24,40,0.08)",
              padding: "0 4px",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#E8792B",
                paddingBottom: 12,
                borderBottom: "2.5px solid #E8792B",
              }}
            >
              My reviews (13)
            </div>
            <div style={{ fontSize: 15, color: "#6B7480", paddingBottom: 12 }}>All projects (15)</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#FFFFFF",
                borderRadius: 999,
                padding: 6,
                boxShadow: "0 2px 8px rgba(16,24,40,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "#F0913F",
                  borderRadius: 999,
                  padding: "9px 16px",
                }}
              >
                Pending with me (3)
              </div>
              <div style={{ fontSize: 13, color: "#4A525E", padding: "9px 14px" }}>
                Sent back for revision (3)
              </div>
              <div style={{ fontSize: 13, color: "#4A525E", padding: "9px 14px" }}>Published (2)</div>
              <div style={{ fontSize: 13, color: "#4A525E", padding: "9px 14px" }}>Completed (5)</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#FCE9D6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 2,
                    background: "#E8792B",
                    boxShadow: "0 4px 0 0 #E8792B, 0 -4px 0 0 #E8792B",
                  }}
                />
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#FCE9D6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid #E8792B",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "16px 14px 10px 14px",
              fontSize: 13,
              fontWeight: 700,
              color: "#2B323C",
            }}
          >
            <div style={{ width: 230, display: "flex", alignItems: "center", gap: 7 }}>
              Project ID
              <svg width="8" height="12" viewBox="0 0 8 12">
                <path d="M4 0.6 7 4.4H1z" fill="#B6BCC5" />
                <path d="M4 11.4 1 7.6h6z" fill="#B6BCC5" />
              </svg>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
              Project name
              <svg width="8" height="12" viewBox="0 0 8 12">
                <path d="M4 0.6 7 4.4H1z" fill="#B6BCC5" />
                <path d="M4 11.4 1 7.6h6z" fill="#B6BCC5" />
              </svg>
            </div>
            <div style={{ width: 140, display: "flex", alignItems: "center", gap: 7 }}>
              Pending since
              <svg width="8" height="12" viewBox="0 0 8 12">
                <path d="M4 0.6 7 4.4H1z" fill="#B6BCC5" />
                <path d="M4 11.4 1 7.6h6z" fill="#B6BCC5" />
              </svg>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 58,
              padding: "0 14px",
              background: "#FFFFFF",
              borderRadius: "10px 10px 0 0",
              fontSize: 14,
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <div style={{ width: 230, color: "#2B323C" }}>2345678</div>
            <div style={{ flex: 1, fontWeight: 500 }}>Online partial discharge 2</div>
            <div style={{ width: 140, color: "#4A525E" }}>1 days ago</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 58,
              padding: "0 14px",
              background: "#FBFBFC",
              fontSize: 14,
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <div style={{ width: 230, color: "#2B323C" }}>3456789</div>
            <div style={{ flex: 1, fontWeight: 500 }}>Interconnection of Arafat Substations 4 &amp; 5…</div>
            <div style={{ width: 140, color: "#4A525E" }}>3 days ago</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 58,
              padding: "0 14px",
              background: "#FFF8F1",
              border: "1.5px solid #EFA163",
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            <div style={{ width: 228, color: "#2B323C" }}>4567890</div>
            <div style={{ flex: 1, fontWeight: 500 }}>Online partial discharge</div>
            <div style={{ width: 140, color: "#4A525E" }}>2 days ago</div>
          </div>
        </div>
      </div>

      {/* ── right rail · reference lines 179–234 ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 440,
          height: 900,
          background: "#F8F9FB",
          boxShadow: "-26px 0 60px rgba(16,24,40,0.10)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ padding: "22px 24px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                flex: "0 1 auto",
                marginRight: "auto",
                whiteSpace: "nowrap",
              }}
            >
              Online partial discharge
            </div>
            <div
              style={{
                flex: "none",
                whiteSpace: "nowrap",
                fontSize: 11,
                color: "#4A525E",
                border: "1px solid rgba(16,24,40,0.14)",
                borderRadius: 999,
                padding: "6px 10px",
                background: "#FFFFFF",
              }}
            >
              Pending with me
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 2px 7px rgba(16,24,40,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                color: "#6B7480",
                letterSpacing: "1px",
                lineHeight: 0,
              }}
            >
              ···
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#14171C" }}>✕</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1.4px solid #C6CCD4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16">
                <path
                  d="M2.2 3.4h11.6v7.4H8.6L5.6 13.2v-2.4H2.2z"
                  fill="none"
                  stroke="#3A424E"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                position: "relative",
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1.4px solid #C6CCD4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16">
                <path
                  d="M4 10.6V7.4a4 4 0 0 1 8 0v3.2l.9 1.3H3.1z"
                  fill="none"
                  stroke="#3A424E"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 13a1.6 1.6 0 0 0 3 0"
                  fill="none"
                  stroke="#3A424E"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#E8433A",
                  border: "1.5px solid #FFFFFF",
                }}
              />
            </div>
            <div style={{ flex: 1, textAlign: "right", fontSize: 11.5, color: "#6B7480" }}>
              Last updated 7/11/1447{" "}{" "}12:00 AM
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 22,
              marginTop: 18,
              borderBottom: "1px solid rgba(16,24,40,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#E8792B",
                paddingBottom: 10,
                borderBottom: "2.5px solid #E8792B",
              }}
            >
              Project Info
            </div>
            <div style={{ fontSize: 14, color: "#4A525E", paddingBottom: 10 }}>Milestones</div>
            <div style={{ fontSize: 14, color: "#4A525E", paddingBottom: 10 }}>Scope</div>
          </div>
        </div>

        <div style={{ padding: "18px 24px 0 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Basic details</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 18px",
              fontSize: 13,
            }}
          >
            <div>
              <div style={{ color: "#7A828D" }}>Project ID</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>2345678</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Project type</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>New</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Category</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>Substation Cabling</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Budget (in MRS)</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>150 MRS</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Project manager</div>
              {/* neutralised — spec §8: the reference names an individual here */}
              <div style={{ fontWeight: 500, marginTop: 4 }}>Project manager - 234567</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Project update reminder</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>Every 15 days</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Business unit</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>Business line name</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Project status</div>
              <div style={{ marginTop: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "#D9534F",
                    background: "#FCE7E4",
                    borderRadius: 999,
                    padding: "4px 12px",
                  }}
                >
                  Delayed
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 13 }}>
            <div style={{ color: "#7A828D" }}>Project details</div>
            <div style={{ fontWeight: 500, marginTop: 4, lineHeight: 1.45, textWrap: "pretty" }}>
              Construction of the Mina-7 Electrical Substation (110/13.8 kV).
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(16,24,40,0.09)", margin: "20px 0" }} />

          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Contract details</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 18px",
              fontSize: 13,
            }}
          >
            <div>
              <div style={{ color: "#7A828D" }}>Contract number</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>3188172</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Contractor name</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>Agency</div>
            </div>
            <div>
              <div style={{ color: "#7A828D" }}>Contract type</div>
              <div style={{ fontWeight: 500, marginTop: 4 }}>In-house</div>
            </div>
          </div>
        </div>

        {/* footer — reference lines 227–233 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 440,
            padding: "20px 24px",
            boxSizing: "border-box",
            borderTop: "1px solid rgba(16,24,40,0.08)",
            background: "#FFFFFF",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#A6ADB6",
              border: "1px solid rgba(16,24,40,0.12)",
              borderRadius: 999,
              padding: "13px 20px",
            }}
          >
            Send back for Revision
          </div>

          {/* wrapper so the flash's `inset: -10` resolves against the button */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                padding: "0 34px",
                borderRadius: 26,
                background: "var(--hj-btnBg, #E8792B)",
                boxShadow: "var(--hj-btnShadow, 0 6px 18px rgba(232,121,43,0.30))",
                transformOrigin: "50% 50%",
                transform: "scale(var(--hj-btnScale, 1))",
                color: "#FFFFFF",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                style={{
                  display: "block",
                  // Deliberate exception to the transform/opacity/filter-only rule: width
                  // and margin animate from 0 so the label slides over rather than jumping
                  // when the check appears. This is the reference's own technique (its
                  // `{{ checkW }}` / `{{ checkGap }}` variables), kept because both are
                  // keyframed and there is no transform-only equivalent of a reveal that
                  // pushes sibling content.
                  width: "var(--hj-checkW, 0px)",
                  marginRight: "var(--hj-checkGap, 0px)",
                  opacity: "var(--hj-checkOpacity, 0)",
                  overflow: "hidden",
                }}
              >
                <path
                  d="M2 7.4l3.2 3.2L12 3.8"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Must match `frame.ts`'s resting `btnLabel`. This is what renders before
                  the first frame callback runs; a mismatch shows as a one-frame flicker. */}
              <span ref={btnLabelRef}>Approve</span>
            </div>

            {/* approval flash — a ring that expands and fades once as the button turns green */}
            <div
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: 34,
                border: "2px solid #2E9E4F",
                pointerEvents: "none",
                transformOrigin: "50% 50%",
                transform: "scale(var(--hj-flashScale, 1))",
                opacity: "var(--hj-flashOpacity, 0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* cursor + click ripple — rendered last, on top of both columns */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "translate(var(--hj-cursorX, 1148px), var(--hj-cursorY, 672px))",
          opacity: "var(--hj-cursorOpacity, 0)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -26,
            top: -26,
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "2px solid #E8792B",
            transformOrigin: "50% 50%",
            transform: "scale(var(--hj-clickScale, 0.5))",
            opacity: "var(--hj-clickOpacity, 0)",
          }}
        />
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ display: "block" }}>
          <path
            d="M4 2l16 9.2-6.6 1.5 3.4 7.2-2.9 1.4-3.4-7.2-4.9 4.6z"
            fill="#121821"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
