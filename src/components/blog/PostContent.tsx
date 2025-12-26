import { MDXContent } from "mdx/types";

export type PostContentProps = {
  content: MDXContent;
};

export function PostContent({ content: Content }: PostContentProps) {
  return (
    <div className="max-w-none">
      <Content />
    </div>
  );
}
