// Each line is a .rise-head step (animations.md, section reveals); `from` is the first line's step in its group.
// Lines stay inline below lg so the heading wraps as before; inline spans can't translate, so there they fade and unblur only.
export function Heading({ lines, from = 0 }: { lines: string[]; from?: number }) {
  return (
    <h2 className="display">
      <span className="rise-head lg:block" style={{ "--i": from } as React.CSSProperties}>{lines[0]}</span>{" "}
      <span className="rise-head text-muted-foreground lg:block" style={{ "--i": from + 1 } as React.CSSProperties}>{lines[1]}</span>
    </h2>
  );
}
