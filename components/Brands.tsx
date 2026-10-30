import { brands } from "@/lib/content";

export function Brands() {
  return (
    <section aria-label="Selected clients" className="border-t border-hairline">
      <ul className="grid grid-cols-2 gap-y-6 px-6 py-10 text-muted-foreground md:flex md:h-[119px] md:items-center md:justify-between md:px-12 md:py-0">
        {brands.map((b) => (
          <li key={b} className="text-base">{b}</li>
        ))}
      </ul>
    </section>
  );
}
