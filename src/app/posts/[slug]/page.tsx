import { getAllPosts, getPostBySlug } from "@/lib/data/posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Time } from "@/components/common/Time";
import { PageContent } from "@/components/pages/PageContent";
import { Heading } from "@/components/common/Heading";

export async function generateStaticParams() {
    const posts = await getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <PageContent className="max-w-3xl">
            <article>
                <header className="mb-8">
                    <Heading as="h1" className="mb-4">{post.title}</Heading>
                    <div className="text-gray-500 text-sm">
                        <Time dateTime={post.date} />
                    </div>
                </header>
                <div className="prose prose-lg max-w-none">
                    <p>{post.content}</p>
                </div>
            </article>
        </PageContent>
    );
}
