import { Lanyard } from "@/components/Lanyard";
import { DottedArrow } from "@/components/DottedArrow";
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
        <div className="lg:border-r lg:border-hairline">
          <Lanyard />
        </div>
        <div className="flex flex-col gap-3 border-t border-hairline px-4 pb-12 pt-8 lg:gap-4 lg:border-t-0 lg:px-12 lg:py-16">
          <div className="flex flex-col items-start gap-6 pb-6 lg:pb-8">
            <p className="micro text-brand">{contact.label}</p>
            <h2 className="display">
              {contact.heading[0]} <span className="text-muted-foreground">{contact.heading[1]}</span>
            </h2>
            <a href={person.calendly} className="label flex w-full items-center justify-center gap-3 rounded-btn bg-brand py-2 pl-6 pr-2 text-brand-foreground lg:w-auto">
              {contact.cta} <DottedArrow />
            </a>
          </div>
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
