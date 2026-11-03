import { person } from "@/lib/content";
import { FooterWordmark } from "@/components/FooterWordmark";

const socials = [
  { label: "LinkedIn", href: person.linkedin, icon: <path d="M5.4 8.2H2V22h3.4V8.2ZM3.7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM22 13.6c0-4.1-2.2-5.9-5.1-5.9-2.3 0-3.3 1.3-3.9 2.2V8.2H9.6V22H13v-7.7c0-2 .8-3.4 2.7-3.4s2.9 1.3 2.9 3.4V22H22v-8.4Z" /> },
  { label: "Behance", href: person.behance, icon: <path d="M1 5h7c3.4 0 5 1.6 5 4.1 0 1.6-.8 2.8-2.1 3.4 1.8.5 2.8 1.9 2.8 3.9 0 2.9-2 4.6-5.5 4.6H1V5Zm3.3 6.5h3.2c1.5 0 2.3-.6 2.3-1.9 0-1.2-.8-1.8-2.3-1.8H4.3v3.7Zm0 6.7h3.5c1.8 0 2.6-.7 2.6-2.1 0-1.5-.9-2.1-2.6-2.1H4.3v4.2ZM16 5h7v2h-7V5Zm8 10.7h-7.8c.1 1.9 1 2.9 2.7 2.9 1.2 0 2-.5 2.4-1.3h2.5c-.8 2.6-2.5 3.8-5 3.8-3.5 0-5.7-2.4-5.7-6 0-3.4 2.2-6 5.6-6 3.7 0 5.5 2.8 5.3 6.6Zm-7.8-2h4.9c-.2-1.5-1-2.2-2.4-2.2s-2.3.8-2.5 2.2Z" /> },
  { label: "Dribbble", href: person.dribbble, icon: <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M7 4c4 5 7 10 9 17M3 10c7 .5 12-1.5 16-5M5 19c3-7 9-9 16-7" /></g> },
];

export function Footer() {
  return (
    <footer className="portfolio-footer border-t border-hairline px-4 pb-12 pt-8 lg:px-12 lg:pb-16 lg:pt-12" aria-label="Connect with Mohammed Rizwan">
      <div className="flex items-center justify-center gap-3 lg:gap-4">
        <img src="/figma/logo-subtract.svg" alt="" width={40} height={40} className="size-8 lg:size-10" />
        <p className="footer-name">{person.name}</p>
      </div>
      <nav aria-label="Social profiles" className="mt-6 flex justify-center gap-8 lg:gap-16">
        {socials.map(({ label, href, icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social flex flex-col items-center gap-2 rounded-sm text-muted-foreground">
            <span className="footer-social-circle flex size-12 items-center justify-center rounded-full border border-hairline lg:size-14">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-6">{icon}</svg>
            </span>
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="footer-divider mx-auto my-4 border-t border-border lg:my-6" />
      <FooterWordmark />
      <p className="footer-copyright mt-4 text-center text-muted-foreground lg:mt-6">© 2026 {person.name}. All rights reserved.</p>
    </footer>
  );
}
