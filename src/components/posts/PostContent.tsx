import { MDXComponents, MDXContent } from "mdx/types";
import { Heading } from "../common/Heading";

const components: MDXComponents = {
  h1: ({ children }) => <Heading as="h2">{children}</Heading>,
  h2: ({ children }) => <Heading as="h3">{children}</Heading>,
  h3: ({ children }) => <Heading as="h4">{children}</Heading>,
};

export type PostContentProps = {
  content: MDXContent;
};

export function PostContent({ content: Content }: PostContentProps) {
  return (
    <div className="max-w-none">
      <Content components={components} />
    </div>
  );
}
