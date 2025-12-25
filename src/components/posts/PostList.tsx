import { Link } from "@/components/common/Link";
import { PostMetadata } from "@/interfaces/post";
import { Time } from "@/components/common/Time";
import { Heading } from "@/components/common/Heading";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

interface PostListProps {
  posts: PostMetadata[];
  variant?: "default" | "compact";
}

export function PostList({ posts, variant = "default" }: PostListProps) {
  if (variant === "compact") {
    return (
      <ItemGroup className="gap-4" aria-label="Compact post list">
        {posts.map((post) => (
          <Item key={post.slug} variant="outline" asChild>
            <Link path={`/posts/${post.slug}`} variant="heading">
              <ItemContent>
                <ItemTitle>
                  <Heading as="h3">{post.title}</Heading>
                </ItemTitle>
                <ItemDescription className="text-sm text-gray-500">
                  <Time dateTime={post.date} />
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    );
  }

  return (
    <ItemGroup className="gap-8" aria-label="Post list">
      {posts.map((post) => (
        <Item key={post.slug} variant="outline">
          <ItemContent>
            <ItemTitle>
              <Heading as="h2">
                <Link path={`/posts/${post.slug}`} variant="heading">
                  {post.title}
                </Link>
              </Heading>
            </ItemTitle>
            <div className="text-sm text-gray-500 mb-3">
              <Time dateTime={post.date} />
            </div>
            <ItemDescription className="text-gray-700 line-clamp-3 dark:text-gray-300">
              {post.excerpt}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
