/**
 * The six floating UI panels, ported from
 * `assets/Project3_artifacts/Emirates Islamic project hover.html`.
 *
 * Authored in the reference's own layout box (see `geometry.ts` — `REF_BOX_W` wide),
 * so every value below is the reference's verbatim: its `cqw` container units, its px
 * radii and its hex. `scene.tsx` places the whole box with one uniform transform. Do
 * not convert these to canvas px; the point of the shared space is that the port can
 * be diffed against the source line by line.
 *
 * `cqw` resolves against the ref box because `scene.tsx` sets `container-type: size`
 * on it, exactly as the reference sets it on its card. 1cqw = 12.4 ref px = 5.83
 * canvas px.
 *
 * No clock access here (animations.md §3): these are pure layout. Visibility and
 * motion belong to `scene.tsx`.
 */

const PURPLE = "#5b2a72";
const INK = "#4a4450";

/** Reference: the account-selection panel. Two account rows with balances. */
export function AccountsPanel() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 1cqw",
      }}
    >
      {[
        { label: "CURRENT ACCOUNT", amount: "AED 21,005.29" },
        { label: "SAVINGS ACCOUNT", amount: "AED 51,765.64" },
      ].map((row, i) => (
        <div key={row.label}>
          {i === 1 && <div style={{ height: 1, background: "#ece9ee" }} />}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85cqw",
              padding: "0.7cqw 0",
            }}
          >
            <div
              style={{
                width: "2.9cqw",
                height: "1.85cqw",
                borderRadius: "0.25cqw",
                background: PURPLE,
                flex: "none",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.12cqw" }}>
              <div style={{ fontSize: "0.72cqw", letterSpacing: ".02em", color: "#6f6875" }}>
                {row.label}
              </div>
              <div style={{ fontSize: "0.78cqw", color: INK }}>37074837711001</div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.1cqw",
              }}
            >
              <div style={{ fontSize: "0.58cqw", letterSpacing: ".03em", color: "#8f8996" }}>
                BALANCE
              </div>
              <div style={{ fontSize: "0.95cqw", fontWeight: 600, color: "#4a2b5e" }}>
                {row.amount}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Reference: the cardless-ATM panel. A suggested-amount grid on an orange rule. */
export function AtmPanel() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "0.85cqw 1cqw",
        display: "flex",
        flexDirection: "column",
        gap: "0.7cqw",
      }}
    >
      <div style={{ fontSize: "0.82cqw", color: "#5f5568" }}>Select suggested amount</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          background: "#e8a87c",
          border: "1px solid #e8a87c",
          margin: "0 0.6cqw",
        }}
      >
        {["100", "200", "500", "700", "1,000", "2,000"].map((amount) => (
          <div
            key={amount}
            style={{
              background: "#fff",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "0.3cqw",
              padding: "0.55cqw 0",
            }}
          >
            <span style={{ fontSize: "0.42cqw", color: "#a7a1ad" }}>AED</span>
            <span style={{ fontSize: "0.95cqw", fontWeight: 600, color: INK }}>{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Reference: the voucher-transfer panel. Three underlined form rows. */
export function VoucherPanel() {
  const rows = [
    { label: "Beneficiary Email", value: "MohammedFaizal@abc.com", chevron: false },
    { label: "Country", value: "CANADA", chevron: true },
    { label: "Currency", value: "USD", chevron: true },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "0.7cqw 1cqw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      {rows.map((row) => (
        <div key={row.label} style={{ display: "flex", alignItems: "flex-end", gap: "1cqw" }}>
          <div style={{ fontSize: "0.78cqw", color: "#57505d", width: "7.5cqw", flex: "none" }}>
            {row.label}
          </div>
          <div
            style={{
              flex: 1,
              borderBottom: "1px solid #b9b3bf",
              paddingBottom: "0.2cqw",
              fontSize: "0.8cqw",
              color: INK,
              display: "flex",
              alignItems: "center",
            }}
          >
            {row.value}
            {row.chevron && (
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9b95a1",
                  fontSize: "1cqw",
                  lineHeight: 1,
                }}
              >
                ›
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Shared: the three-dot progress rail at the top of every phone screen. */
function PhoneSteps({ done }: { done: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0.5cqw 0.45cqw 0.42cqw" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "contents" }}>
          {i > 0 && <div style={{ flex: 1, height: 1, background: "#e2dee6" }} />}
          <div
            style={{
              width: "1.05cqw",
              height: "1.05cqw",
              borderRadius: "50%",
              flex: "none",
              background: i < done ? "#45bfae" : i === done ? PURPLE : undefined,
              border: i > done ? "1px solid #ded9e2" : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function PhoneHeader({ label, center }: { label: string; center?: boolean }) {
  return (
    <div
      style={{
        background: "#5e2a6e",
        padding: "0.42cqw 0.45cqw",
        fontSize: "0.46cqw",
        fontWeight: 600,
        color: "#fff",
        textAlign: center ? "center" : undefined,
      }}
    >
      {label}
    </div>
  );
}

/** Reference: phone A — account list on the cardless-ATM flow. */
export function PhoneAccounts() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <PhoneHeader label="EI ATM – To Myself" />
      <PhoneSteps done={0} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.24cqw",
            padding: "0.34cqw 0.3cqw",
            background: "#eceaee",
            borderTop: "1px solid #ddd9e0",
          }}
        >
          <div
            style={{
              width: "0.95cqw",
              height: "0.6cqw",
              borderRadius: "0.08cqw",
              background: PURPLE,
              flex: "none",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.04cqw", minWidth: 0 }}>
            <div style={{ fontSize: "0.28cqw", color: INK, whiteSpace: "nowrap" }}>
              CURRENT ACCOUNT
            </div>
            <div style={{ fontSize: "0.28cqw", color: INK, whiteSpace: "nowrap" }}>
              37074837711001
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: "0.3cqw",
              color: PURPLE,
              whiteSpace: "nowrap",
              flex: "none",
            }}
          >
            AED 21,005.29
          </div>
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.32cqw",
              padding: "0.38cqw 0.45cqw",
              borderTop: "1px solid #f0edf2",
            }}
          >
            <div
              style={{
                width: "1.15cqw",
                height: "0.72cqw",
                borderRadius: "0.12cqw",
                background: PURPLE,
                flex: "none",
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.14cqw" }}>
              <div style={{ height: "0.2cqw", width: "74%", background: "#d8d3dd" }} />
              <div style={{ height: "0.18cqw", width: "62%", background: "#e6e2ea" }} />
            </div>
            <div style={{ width: "1.5cqw", height: "0.26cqw", background: "#c9b8d4", flex: "none" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Reference: phone B — the amount grid, mirroring the ATM panel above it. */
export function PhoneAmount() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <PhoneHeader label="EI ATM – To Myself" />
      <PhoneSteps done={1} />
      <div
        style={{
          background: "#eeecf0",
          padding: "0.3cqw 0.45cqw",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ height: "0.22cqw", width: "60%", background: "#c6c1cb" }} />
      </div>
      <div style={{ padding: "0.5cqw 0.45cqw 0.35cqw" }}>
        <div style={{ height: "0.24cqw", width: "52%", background: "#cfc9d4" }} />
      </div>
      <div
        style={{
          margin: "0 0.7cqw",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          background: "#e8a87c",
          border: "1px solid #e8a87c",
        }}
      >
        {["100", "200", "500", "700", "1,000", "2,000"].map((amount) => (
          <div
            key={amount}
            style={{
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.4cqw 0",
              fontSize: "0.42cqw",
              fontWeight: 600,
              color: INK,
            }}
          >
            {amount}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4cqw",
          padding: "0.7cqw 0.45cqw 0",
        }}
      >
        <div style={{ height: "0.22cqw", width: "32%", background: "#cfc9d4", flex: "none" }} />
        <div style={{ flex: 1, height: 1, background: "#e6e2ea" }} />
      </div>
    </div>
  );
}

/** Reference: phone C — the voucher-transfer summary, mirroring the panel above it. */
export function PhoneVoucher() {
  const fields = [
    { label: "Beneficiary Email", value: "MohammedFaizal@abc.com", chevron: false },
    { label: "Country", value: "CANADA", chevron: true },
    { label: "Currency", value: "USD", chevron: true },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <PhoneHeader label="Voucher Transfer" center />
      <PhoneSteps done={1} />
      <div
        style={{
          background: "#eeecf0",
          padding: "0.3cqw 0.45cqw",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ height: "0.22cqw", width: "66%", background: "#c6c1cb" }} />
      </div>
      <div
        style={{
          padding: "0.45cqw 0.4cqw",
          display: "flex",
          flexDirection: "column",
          gap: "0.42cqw",
        }}
      >
        {fields.map((field) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.12cqw",
              borderBottom: "1px solid #e2dee6",
              paddingBottom: "0.16cqw",
            }}
          >
            <div style={{ fontSize: "0.26cqw", color: "#8a8590", whiteSpace: "nowrap" }}>
              {field.label}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  fontSize: "0.3cqw",
                  fontWeight: 600,
                  color: "#2f2b33",
                  whiteSpace: "nowrap",
                }}
              >
                {field.value}
              </div>
              {field.chevron && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: PURPLE,
                    fontSize: "0.5cqw",
                    lineHeight: 0.6,
                  }}
                >
                  ›
                </span>
              )}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4cqw" }}>
          <div style={{ height: "0.2cqw", width: "1.7cqw", background: "#cfc9d4", flex: "none" }} />
          <div
            style={{
              flex: 1,
              borderBottom: "1px solid #cfc9d4",
              paddingBottom: "0.16cqw",
              display: "flex",
              alignItems: "center",
              gap: "0.3cqw",
            }}
          >
            <div style={{ height: "0.2cqw", width: "44%", background: "#ded9e2" }} />
            <div style={{ marginLeft: "auto", display: "flex", flex: "none" }}>
              <div style={{ width: "0.9cqw", height: "0.42cqw", background: "#e8e4ec" }} />
              <div style={{ width: "0.9cqw", height: "0.42cqw", background: "#e8641c" }} />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#eeecf0",
          padding: "0.32cqw 0.45cqw",
          display: "flex",
          gap: "0.5cqw",
        }}
      >
        <div style={{ height: "0.22cqw", width: "38%", background: "#c6c1cb" }} />
        <div style={{ height: "0.22cqw", width: "44%", background: "#c6c1cb" }} />
      </div>
      <div
        style={{
          background: "#eeecf0",
          padding: "0.3cqw 0.45cqw 0.5cqw",
          display: "flex",
          gap: "0.35cqw",
          alignItems: "flex-start",
          borderTop: "1px solid #e4e0e8",
        }}
      >
        <div
          style={{
            width: "0.75cqw",
            height: "0.75cqw",
            borderRadius: "50%",
            border: "1px solid #e8641c",
            flex: "none",
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.16cqw" }}>
          {["96%", "100%", "52%"].map((width) => (
            <div key={width} style={{ height: "0.18cqw", width, background: "#cfc9d4" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** `OVERLAYS` order (o1..o6). Index-aligned with `FROM_X` / `OUT_DELAY_S`. */
export const OVERLAY_BODIES = [
  AccountsPanel,
  AtmPanel,
  VoucherPanel,
  PhoneAccounts,
  PhoneAmount,
  PhoneVoucher,
];
