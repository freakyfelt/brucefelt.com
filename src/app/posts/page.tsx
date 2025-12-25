import { getAllPosts } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";
import { PageContent } from "@/components/pages/PageContent";
import { Heading } from "@/components/common/Heading";

export const metadata = {
    title: "Posts Page",
};

export default async function PostsPage() {
    const posts = await getAllPosts();

    return (
        <PageContent>
            <Heading as="h1">Posts Page</Heading>
            <PostList posts={posts} />
        </PageContent>
    );
}
