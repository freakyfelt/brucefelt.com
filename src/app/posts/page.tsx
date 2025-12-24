import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
    title: "Posts Page",
};

export default async function PostsPage() {
    const posts = await getAllPosts();

    return (
        <main>
            <h1>Posts Page</h1>

            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <h2>
                            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p>{post.date}</p>
                        <p>{post.excerpt}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
