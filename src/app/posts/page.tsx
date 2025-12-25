import { getAllPostMetadata } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";
import { PageContent } from "@/components/pages/PageContent";
import { Heading } from "@/components/common/Heading";

export const metadata = {
  title: "Posts",
};

export default async function PostsPage() {
  const posts = await getAllPostMetadata();

  return (
    <PageContent>
      <Heading as="h1">Posts</Heading>
      <PostList posts={posts} />
    </PageContent>
  );
}
