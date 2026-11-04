import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Frame } from "@/components/Frame";
import { DottedArrow } from "@/components/DottedArrow";
import { notFoundPage, person } from "@/lib/content";
import { doto } from "@/lib/fonts";

// 404 (owner, 2026-11-04): the 21st.dev "Pixeleted 404" layout without its postcard picture and spinning circle text,
// in the site's dark theme. Catches unknown URLs and bad /work/* slugs (that route calls notFound()).
export const metadata: Metadata = {
  title: `${notFoundPage.title} | ${person.name}`,
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={`${doto.variable} pt-header-offset-sm md:pt-header-offset`}>
        <Frame>
          <section className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-8">
            <h1 className="display display-pixel w-full max-w-hero-headline">
              {notFoundPage.heading[0]} <span className="text-muted-foreground">{notFoundPage.heading[1]}</span>
            </h1>
            <p className="w-full max-w-hero-subline text-muted-foreground">{notFoundPage.subline}</p>
            <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
              <a href="/" className="label label-cta flex w-full items-center justify-center gap-3 rounded-btn bg-brand py-2 pl-6 pr-2 text-brand-foreground md:w-auto">
                {notFoundPage.cta} <DottedArrow direction="right" />
              </a>
              <a href="/#works" className="label text-muted-foreground underline underline-offset-4 hover:text-foreground">
                {notFoundPage.secondary}
              </a>
            </div>
          </section>
        </Frame>
      </main>
    </>
  );
}
