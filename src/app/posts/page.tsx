import { getAllPosts } from "@/lib/data/posts";
import { PostList } from "@/components/posts/PostList";
import { PageContent } from "@/components/pages/PageContent";
import { Header } from "@/components/common/Header";

export const metadata = {
    title: "Posts Page",
};

export default async function PostsPage() {
    const posts = await getAllPosts();

    return (
        <PageContent>
            <Header as="h1">Posts Page</Header>
            <PostList posts={posts} />
        </PageContent>
    );
}
