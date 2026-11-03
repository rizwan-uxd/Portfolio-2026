import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { Contact } from "@/components/Contact";
import { Frame } from "@/components/Frame";
import { Header } from "@/components/Header";
import { ScrollTop } from "@/components/ScrollTop";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { person } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return { title: `${study.title.join(" ")} — ${person.name}`, description: study.summary };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  return (
    <>
      <Header />
      <main className="pt-header-offset-sm md:pt-header-offset">
        <Frame>
          <CaseStudy study={study} />
          <Contact />
        </Frame>
      </main>
      <ScrollTop bar={false} />
    </>
  );
}
