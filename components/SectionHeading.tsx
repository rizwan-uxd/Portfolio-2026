export function Heading({ lines }: { lines: string[] }) {
  return (
    <h2 className="display">
      <span className="lg:block">{lines[0]} </span>
      <span className="text-muted-foreground lg:block">{lines[1]}</span>
    </h2>
  );
}
