import { person, contact } from "@/lib/content";

const fields = [
  { label: "Email", value: person.email, href: `mailto:${person.email}` },
  { label: "Phone", value: person.phone, href: `tel:${person.phone.replace(/\s/g, "")}` },
];

const socials = [
  { label: "LinkedIn", href: person.linkedin },
  { label: "Dribbble", href: person.dribbble },
  { label: "Behance", href: person.behance },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-hairline">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="min-w-0 px-6 py-12 md:border-r md:border-hairline md:px-12 md:py-16">
          {/* Placeholder initials: swap for the real photo from the live site's public/images/profile.png */}
          <div className="flex size-[88px] items-center justify-center rounded-full border-2 border-brand bg-secondary text-[32px] shadow-[0_0_24px_rgb(229_255_93/.35)]" aria-hidden>
            MR
          </div>
          <p className="micro mt-6 text-brand">{contact.label}</p>
          <h2 className="display mt-6 max-w-[510px]">
            {contact.heading[0]} <span className="text-muted-foreground">{contact.heading[1]}</span>
          </h2>
          <a href={person.calendly} className="label mt-10 inline-flex h-10 items-center gap-3 rounded-btn bg-brand px-6 text-brand-foreground">
            {contact.cta} <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="min-w-0 border-t border-hairline px-6 py-12 md:border-t-0 md:px-12 md:py-16">
          <p className="micro text-muted-foreground">{contact.connectLabel}</p>
          <div className="mt-4 space-y-4">
            {fields.map((f) => (
              <a key={f.label} href={f.href} className="flex items-center gap-4 rounded-lg border border-border bg-card px-6 py-4 transition-colors hover:border-hairline">
                <span className="micro w-16 shrink-0 text-muted-foreground">{f.label}</span>
                <span className="subtitle min-w-0 flex-1 break-words">{f.value}</span>
                <span aria-hidden className="text-muted-foreground">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-6 border-t border-hairline px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12">
        <div>
          <p>{person.name}</p>
          <p className="micro mt-1 text-muted-foreground">{contact.copyright}</p>
        </div>
        <ul className="flex gap-8">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="label inline-flex items-center gap-1">
                {s.label} <span aria-hidden className="text-[10px]">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}
