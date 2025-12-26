import { getAllPosts } from "@/lib/data/blog";
import { paths } from "@/lib/utils/url";
import { permanentRedirect } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostRedirect({ params }: Props) {
  const { slug } = await params;

  permanentRedirect(paths.blogPost(slug));
}
