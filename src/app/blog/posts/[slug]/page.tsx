import { getAllPosts, getPostBySlug } from "@/lib/data/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Time } from "@/components/common/Time";
import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";
import { PostContent } from "@/components/blog/PostContent";
import { PostTags } from "@/components/blog/PostTags";
import { ArchivedBanner } from "@/components/blog/ArchivedBanner";

export async function generateStaticParams() {
  const posts = await getAllPosts({ includeNonActive: true });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageContent>
      <article>
        <header>
          <Heading as="h1">{post.title}</Heading>
          <div className="border-b border-border text-muted-foreground text-sm pb-2 mb-4 flex justify-between items-center">
            <Time dateTime={post.publishDate} />
            <PostTags tags={post.tags || []} />
          </div>
          {post.status === "archived" && <ArchivedBanner />}
        </header>
        <PostContent content={post.content} />
      </article>
    </PageContent>
  );
}
