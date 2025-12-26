import { Link } from "@/components/common/Link";
import { paths } from "@/lib/utils/url";

interface PostTagsProps {
  tags: string[];
}

export function PostTags({ tags }: PostTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link key={tag} path={paths.blogTag(tag)} variant="nav">
          #{tag}
        </Link>
      ))}
    </div>
  );
}
