import type { Metadata } from "next";
import { getDictionary } from "@/content/dictionaries";
import { alternates, type Locale } from "@/i18n/config";
import { SceneTrack } from "@/components/home/SceneTrack";
import { Clients } from "@/components/home/Clients";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { Loader } from "@/components/home/Loader";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternates(locale, "/") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <>
      <Loader caption={t.home.loader.caption} />
      <SceneTrack t={t.home} />
      <Clients t={t.home.clients} />
      <SelectedWork locale={locale} t={t.home.selectedWork} />
      <Testimonials t={t.home.testimonials} />
      <Faq t={t.home.faq} />
      <CtaBand t={t.home.cta} startProjectSubject={t.startProjectSubject} />
    </>
  );
}
