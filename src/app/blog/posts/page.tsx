import { getAllPosts } from "@/lib/data/blog";
import { PostList } from "@/components/blog/PostList";
import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";

export const metadata = {
  title: "Blog Posts",
};

export default async function BlogPostsPage() {
  const posts = await getAllPosts();

  return (
    <PageContent>
      <Heading as="h1">Blog Posts</Heading>
      <PostList posts={posts} />
    </PageContent>
  );
}
