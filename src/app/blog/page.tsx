import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog And Learnings",
  description: "My learnings and experiences",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog & learnings</h1>
      </BlurFade>
      <div className="relative">
        <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />
        {posts
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post, id, arr) => (
            <div key={post.slug} className="relative mb-8">
              <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
                <Link
                  className="flex flex-col space-y-1 pl-8"
                  href={`/blog/${post.slug}`}
                >
                  <div className="w-full flex flex-col">
                    <p className="tracking-tight">{post.metadata.title}</p>
                    <p className="h-6 text-xs text-muted-foreground">
                      {post.metadata.publishedAt}
                    </p>
                  </div>
                </Link>
              </BlurFade>
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
      </div>
    </section>
  );
}
