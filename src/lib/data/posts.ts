import { Post } from "@/interfaces/post";
import { cache } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderToPost = (data: any): Post => ({
    title: data.title,
    slug: data.id.toString(),
    date: data.date || '2024-01-01',
    excerpt: data.body.substring(0, 100) + '...',
    content: data.body,
});

export const getAllPosts = cache(async (): Promise<Post[]>  => {
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json());

    return posts.map(placeholderToPost)
})

export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`)
    if (!res.ok) {
        throw new Error(`Failed to fetch post with slug: ${slug}`);
    }
    const post = await res.json();

    return placeholderToPost(post);
});
