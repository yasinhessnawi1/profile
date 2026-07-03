import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBlogPosts, getPost } from "@/data/blog";
import { Badge } from "@/components/signal/badge";
import { Icon } from "@/components/signal/icon";
import { TopBar } from "@/components/sections/top-bar";
import { Footer } from "@/components/sections/footer";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  try {
    const post = await getPost(slug, locale);
    return {
      title: post.metadata.title,
      description: post.metadata.summary,
      alternates: {
        canonical: locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
        languages: {
          en: `/blog/${slug}`,
          no: `/no/blog/${slug}`,
          "x-default": `/blog/${slug}`,
        },
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPost({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const tBlog = await getTranslations("blog");
  const tNav = await getTranslations("nav");
  let post: Awaited<ReturnType<typeof getPost>>;
  try {
    post = await getPost(slug, locale);
  } catch {
    notFound();
  }

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
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-fg-muted no-underline hover:text-accent"
        >
          <Icon name="arrow-right" size={14} className="rotate-180" /> {t("back")}
        </Link>
        <div className="mb-3.5 flex items-center gap-2.5">
          <Badge
            tone={post.metadata.level === "Master's" ? "signal" : "neutral"}
            size="sm"
            dot={post.metadata.level === "Master's"}
          >
            {post.metadata.level === "Master's"
              ? tBlog("mastersProgramme")
              : tBlog("bachelorProgramme")}
          </Badge>
          <span className="font-mono text-2xs text-fg-faint">
            {post.metadata.publishedAt}
          </span>
        </div>
        <h1 className="display mb-4 mt-0 text-3xl font-medium">
          {post.metadata.title}
        </h1>
        <p className="m-0 mb-2 border-b border-line pb-[18px] text-base leading-[1.6] text-fg [text-wrap:pretty]">
          {post.metadata.summary.replace(/\s*\([^)]*\)\s*$/, "")}
        </p>
        <article
          className="prose-signal mt-4"
          dangerouslySetInnerHTML={{ __html: post.source }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
