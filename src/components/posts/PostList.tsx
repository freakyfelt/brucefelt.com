import { Link } from "@/components/common/Link";
import { Post } from "@/interfaces/post";
import { Time } from "@/components/common/Time";
import { Heading } from "@/components/common/Heading";

interface PostListProps {
  posts: Post[];
  variant?: "default" | "compact";
}

export function PostList({ posts, variant = "default" }: PostListProps) {
  if (variant === "compact") {
    return (
      <ul className="space-y-4" aria-label="Compact post list">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="border-b border-gray-200 pb-2 last:border-0"
          >
            <Heading as="h3" className="mb-0">
              <Link path={`/posts/${post.slug}`} variant="heading">
                {post.title}
              </Link>
            </Heading>
            <p className="text-sm text-gray-500">
              <Time dateTime={post.date} />
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-8" aria-label="Post list">
      {posts.map((post) => (
        <li key={post.slug} className="group">
          <article>
            <Heading as="h2" className="mb-2">
              <Link path={`/posts/${post.slug}`} variant="heading">
                {post.title}
              </Link>
            </Heading>
            <p className="text-sm text-gray-500 mb-3">
              <Time dateTime={post.date} />
            </p>
            <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
