import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getResume } from "@/data/get-resume";
import { getBlogPosts } from "@/data/blog";
import { TopBar } from "@/components/sections/top-bar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Toolkit } from "@/components/sections/toolkit";
import { SkillsBlog, type BlogPostView } from "@/components/sections/skills-blog";
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
  const raw = await getBlogPosts(locale);
  const posts: BlogPostView[] = raw
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .map((p) => ({
      slug: p.slug,
      title: p.metadata.title,
      publishedAt: p.metadata.publishedAt,
      summary: p.metadata.summary,
      level: p.metadata.level,
      html: p.source,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: data.name,
            url: "https://yasinhessnawi.online",
            image: "https://yasinhessnawi.online/me.JPG",
            jobTitle: data.role,
            worksFor: { "@type": "Organization", name: "Safe Media AI AS" },
            alumniOf: { "@type": "CollegeOrUniversity", name: "NTNU" },
            sameAs: [data.contact.github, data.contact.linkedin],
          }),
        }}
      />
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
        <SkillsBlog posts={posts} locale={locale} />
        <ContactSection data={data} />
      </main>
      <Footer locale={locale} />
      <SiteDock />
    </>
  );
}
