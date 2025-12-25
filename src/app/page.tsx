import { PageContent } from "@/components/pages/PageContent";
import { Heading } from "@/components/common/Heading";
import { getRecentPosts } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";

export default async function Home() {
  const recentPosts = await getRecentPosts();

  return (
    <PageContent>
      <div>
        <Heading as="h2">Recent Posts</Heading>
        <PostList posts={recentPosts} variant="compact" />
      </div>
    </PageContent>
  );
}
