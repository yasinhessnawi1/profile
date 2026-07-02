import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getResume } from "@/data/get-resume";
import { TopBar } from "@/components/sections/top-bar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Toolkit } from "@/components/sections/toolkit";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { SiteDock } from "@/components/sections/site-dock";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("nav");
  const data = getResume(locale);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-md bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("skipToContent")}
      </a>
      <TopBar />
      <main id="main">
        <Hero data={data} locale={locale} />
        <About data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Toolkit data={data} />
        {/* SkillsBlog section inserted in Task 10 */}
        <ContactSection data={data} />
      </main>
      <Footer locale={locale} />
      <SiteDock />
    </>
  );
}
