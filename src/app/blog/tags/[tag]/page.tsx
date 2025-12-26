import { getPostsByTag, getAllTags } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";
import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";
import { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged with "${tag}"`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <PageContent>
      <Heading as="h1">{`Posts tagged with "${tag}"`}</Heading>
      <PostList posts={posts} />
    </PageContent>
  );
}
