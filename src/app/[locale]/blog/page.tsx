import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/data/blog";
import { Badge } from "@/components/signal/badge";
import { SectionLabel } from "@/components/signal/section-label";
import { TopBar } from "@/components/sections/top-bar";
import { Footer } from "@/components/sections/footer";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const posts = await getBlogPosts(locale);
  return {
    title: t("title"),
    description: t("description", { count: posts.length }),
  };
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const tBlog = await getTranslations("blog");
  const tNav = await getTranslations("nav");
  const posts = (await getBlogPosts(locale)).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-md bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {tNav("skipToContent")}
      </a>
      <TopBar />
      <main id="main" className="container-narrow section">
        <SectionLabel className="mb-4">{tBlog("eyebrow")}</SectionLabel>
        <h1 className="display mb-10 mt-0 text-3xl font-medium">{t("title")}</h1>
        <div className="relative">
          <div className="absolute bottom-2 left-[5px] top-2 w-[1.5px] bg-line" />
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative rounded-md border border-transparent py-3 pl-7 pr-3 no-underline transition-colors duration-fast ease-out hover:border-line hover:bg-surface"
              >
                <span className="absolute left-0 top-[19px] h-2.5 w-2.5 rounded-full border-2 border-line-strong bg-surface-2 transition-colors duration-fast ease-out group-hover:border-accent" />
                <div className="mb-1 flex items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-wide text-fg-faint">
                    {post.metadata.publishedAt}
                  </span>
                  <Badge
                    tone={post.metadata.level === "Master's" ? "signal" : "neutral"}
                    size="sm"
                  >
                    {post.metadata.level}
                  </Badge>
                </div>
                <div className="text-base font-medium text-fg group-hover:text-fg-strong">
                  {post.metadata.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
