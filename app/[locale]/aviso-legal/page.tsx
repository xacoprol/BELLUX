import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import Footer from "@/components/Footer";
import { getLegalDoc } from "@/lib/i18n/legal";
import { isLocale } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const doc = getLegalDoc(locale, "aviso-legal");
  return buildPageMetadata({
    locale,
    title: doc.title,
    description: doc.description,
    path: doc.path,
  });
}

export default function AvisoLegalPage() {
  return (
    <>
      <main>
        <LegalDocument docId="aviso-legal" />
      </main>
      <Footer />
    </>
  );
}
