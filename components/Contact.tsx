import Image from "next/image";
import { contact, person } from "@/lib/content";

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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6 px-4 py-12 lg:border-r lg:border-hairline lg:px-12 lg:py-16">
          <span className="relative block size-18 overflow-hidden rounded-full border-2 border-brand bg-secondary drop-shadow-[var(--shadow-avatar)] lg:size-22">
            <Image src="/images/profile.png" alt={`Portrait of ${person.name}`} fill sizes="(min-width: 64rem) 88px, 72px" className="origin-top scale-125 object-cover object-top" />
          </span>
          <p className="micro text-brand">{contact.label}</p>
          <h2 className="display">
            {contact.heading[0]} <span className="text-muted-foreground">{contact.heading[1]}</span>
          </h2>
          <a href={person.calendly} className="label flex w-full items-center justify-center gap-2 rounded-btn bg-brand px-6 py-4 text-brand-foreground lg:w-auto lg:py-3">
            {contact.cta} <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="flex flex-col gap-3 border-t border-hairline px-4 pb-12 pt-8 lg:gap-4 lg:border-t-0 lg:px-12 lg:py-16">
          <p className="micro text-muted-foreground">{contact.connectLabel}</p>
          {fields.map((f) => (
            <a key={f.label} href={f.href} className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-4 lg:gap-4 lg:px-6">
              <span className="micro w-12 shrink-0 text-muted-foreground lg:w-16">{f.label}</span>
              <span className="subtitle min-w-0 flex-1">{f.value}</span>
              <span aria-hidden className="subtitle shrink-0 text-muted-foreground">↗</span>
            </a>
          ))}
        </div>
      </div>
      <footer className="flex flex-col-reverse gap-4 border-t border-hairline px-4 pb-8 pt-6 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-6">
        <div className="flex flex-col gap-1">
          <p>{person.name}</p>
          <p className="micro text-muted-foreground">{contact.copyright}</p>
        </div>
        <div className="label flex justify-between lg:gap-8">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="flex items-center gap-1">
              {s.label} <span aria-hidden className="text-muted-foreground">↗</span>
            </a>
          ))}
        </div>
      </footer>
    </section>
  );
}
