import type { ReactNode } from "react";

export function ServiceBox({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div data-service-box data-rise className={className}>
      {children}
    </div>
  );
}
