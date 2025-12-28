import { Link } from "@/components/common/Link";
import { Post } from "@/interfaces/post";
import { Time } from "@/components/common/Time";
import { Heading } from "@/components/common/Heading";
import { paths } from "@/lib/utils/url";
import { PostTags } from "@/components/blog/PostTags";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

interface PostListProps {
  posts: Post[];
  variant?: "default" | "compact";
}

export function PostList({ posts, variant = "default" }: PostListProps) {
  if (variant === "compact") {
    return (
      <ItemGroup aria-label="Compact post list">
        {posts.map((post) => (
          <Item key={post.slug} asChild>
            <Link path={paths.blogPost(post.slug)} variant="none">
              <ItemContent>
                <ItemTitle>{post.title}</ItemTitle>
                <ItemDescription>
                  <Time dateTime={post.publishDate} />
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
                <Link path={paths.blogPost(post.slug)} variant="heading">
                  {post.title}
                </Link>
              </Heading>
            </ItemTitle>
            <div className="text-sm text-muted-foreground mb-3 flex justify-between items-center">
              <Time dateTime={post.publishDate} />
              <PostTags tags={post.tags || []} />
            </div>
            <ItemDescription className="text-foreground">
              {post.description}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
