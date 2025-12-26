import { getAllPosts } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";
import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";

export const metadata = {
  title: "Posts",
};

export default async function BlogPostsPage() {
  const posts = await getAllPosts();

  return (
    <PageContent>
      <Heading as="h1">Posts</Heading>
      <PostList posts={posts} />
    </PageContent>
  );
}
