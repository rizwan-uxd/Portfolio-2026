import { Lanyard } from "@/components/Lanyard";
import { DottedArrow } from "@/components/DottedArrow";
import { Footer } from "@/components/Footer";
import { contact, person } from "@/lib/content";

const fields = [
  { label: "Email", value: person.email, href: `mailto:${person.email}` },
  { label: "Phone", value: person.phone, href: `tel:${person.phone.replace(/\s/g, "")}` },
];

const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Contact() {
  return (
    <section id="contact" className="border-t border-hairline">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:border-r lg:border-hairline">
          <Lanyard />
        </div>
        <div data-rise className="flex flex-col gap-3 border-t border-hairline px-4 pb-12 pt-8 lg:gap-4 lg:border-t-0 lg:px-12 lg:py-16">
          <div className="flex flex-col items-start gap-6 pb-6 lg:pb-8">
            <p className="rise-head micro text-brand" style={step(0)}>{contact.label}</p>
            <h2 className="rise-head display" style={step(1)}>
              {contact.heading[0]} <span className="text-muted-foreground">{contact.heading[1]}</span>
            </h2>
            <a href={person.calendly} style={step(2)} className="rise-head label label-cta flex w-full items-center justify-center gap-3 rounded-btn bg-brand py-2 pl-6 pr-2 text-brand-foreground lg:w-auto">
              {contact.cta} <DottedArrow />
            </a>
          </div>
          <p className="rise-head micro text-muted-foreground" style={step(3)}>{contact.connectLabel}</p>
          {fields.map((f, i) => (
            <a key={f.label} href={f.href} style={{ ...step(i), "--rise-at": "240ms" } as React.CSSProperties} className="rise-card flex items-center gap-3 rounded-lg border border-hairline bg-card p-4 lg:gap-4 lg:px-6">
              <span className="micro w-12 shrink-0 text-muted-foreground lg:w-16">{f.label}</span>
              <span className="subtitle min-w-0 flex-1">{f.value}</span>
              <span aria-hidden className="subtitle shrink-0 text-muted-foreground">↗</span>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
}
