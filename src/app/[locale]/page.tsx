import type { Metadata, Viewport } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { LabApp } from "@/components/lab/lab-app";
import { BOOT_SCRIPT, NOSCRIPT_CSS } from "@/components/lab/boot";
import { CONTENT, type Lang } from "@/components/lab/content";

const asLang = (locale: string): Lang => (locale === "no" ? "no" : "en");

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const L = CONTENT[asLang(locale)];
  return {
    title: { absolute: L.meta.title },
    description: L.meta.description,
    openGraph: {
      type: "website",
      url: locale === "en" ? "/" : `/${locale}`,
      siteName: "Yasin Hessnawi",
      locale: locale === "no" ? "nb_NO" : "en_US",
      title: L.ui.title,
      description: L.hero,
      images: [{ url: "/og-gate.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: L.ui.title, description: L.hero, images: ["/og-gate.png"] },
  };
}

export const viewport: Viewport = { themeColor: "#0B1020" };

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Yasin Hessnawi",
            url: "https://yasinhessnawi.online",
            image: "https://yasinhessnawi.online/me.JPG",
            email: `mailto:${CONTENT.email}`,
            jobTitle: "AI engineer",
            worksFor: { "@type": "Organization", name: "Safe Media AI AS" },
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "University of Agder" },
              { "@type": "CollegeOrUniversity", name: "NTNU" },
            ],
            sameAs: [CONTENT.linkedin, CONTENT.github],
          }),
        }}
      />
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <noscript>
        <style>{NOSCRIPT_CSS}</style>
      </noscript>
      <LabApp locale={asLang(locale)} />
    </>
  );
}
