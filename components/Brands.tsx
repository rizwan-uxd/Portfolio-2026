import { brands, brandsLabel } from "@/lib/content";

export function Brands() {
  return (
    <section aria-label="Selected clients" className="border-t border-hairline">
      <p className="micro px-4 pb-2 pt-4 text-muted-foreground lg:hidden">{brandsLabel}</p>
      <ul className="grid grid-cols-2 text-muted-foreground lg:flex lg:items-center lg:justify-between lg:gap-16 lg:p-12">
        {brands.map((b, i) => (
          <li key={b} className={`border-t border-hairline px-3 py-4 text-center lg:border-0 lg:p-0 ${i % 2 === 0 ? "border-r lg:border-r-0" : ""}`}>
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
