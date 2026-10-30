export function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`frame ${className}`}>{children}</div>;
}
