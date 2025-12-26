import { getPostsByTag, getAllTags, getTagBySlug } from "@/lib/data/blog";
import { PostList } from "@/components/blog/PostList";
import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged with #${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.slug,
  }));
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(slug);

  return (
    <PageContent>
      <Heading as="h1">{`Posts tagged with #${slug}`}</Heading>
      {tag.description && <p className="text-lg mb-8">{tag.description}</p>}
      <PostList posts={posts} />
    </PageContent>
  );
}
