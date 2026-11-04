import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { Contact } from "@/components/Contact";
import { Frame } from "@/components/Frame";
import { Header } from "@/components/Header";
import { ScrollTop } from "@/components/ScrollTop";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { person, socialPreview } from "@/lib/content";
import { previewImage } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const title = `${study.title.join(" ")} | ${person.name}`;
  const url = `/work/${study.slug}`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: { type: "article", url, siteName: socialPreview.siteName, title, description: study.summary, images: [previewImage] },
    twitter: { card: "summary_large_image", title, description: study.summary, images: [previewImage] },
  };
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
