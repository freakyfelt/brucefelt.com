import {
  getAllPostMetadata,
  getPostContent,
  getPostMetadataBySlug,
} from "@/lib/data/posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Time } from "@/components/common/Time";
import { PageContent } from "@/components/pages/PageContent";
import { Heading } from "@/components/common/Heading";
import { PostContent } from "@/components/posts/PostContent";

export async function generateStaticParams() {
  const posts = await getAllPostMetadata();

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
  const post = await getPostMetadataBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostMetadataBySlug(slug);

  if (!post) {
    notFound();
  }
  const content = await getPostContent(slug);

  return (
    <PageContent>
      <article>
        <header>
          <Heading as="h1">{post.title}</Heading>
          <div className="border-b-1 border-gray-300 text-gray-500 text-sm pb-2 mb-4 dark:border-gray-700">
            <Time dateTime={post.date} />
          </div>
        </header>
        <PostContent content={content} />
      </article>
    </PageContent>
  );
}
