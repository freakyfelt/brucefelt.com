import type { MDXComponents } from "mdx/types";
import { Heading } from "@/components/common/Heading";
import { ExternalLink } from "@/components/common/Link";
import { CodeBlock, InlineCode } from "@/components/common/Code";
import { Blockquote } from "@/components/mdx/blockquote";
import { Callout } from "@/components/common/Callout";
import { CalloutTypeHandlers } from "@/components/mdx/callout";
import {
  ImageCarousel,
  ImageCarouselItem,
} from "@/components/images/ImageCarousel";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: ({ children, className }) => {
      if (typeof children !== "string") {
        return <code>{children}</code>;
      }

      const isInline = !children.match(/\n/);
      if (isInline) {
        return <InlineCode>{children}</InlineCode>;
      }

      // ""```typescript" gets parsed by Rehype as "language-typescript"
      const language = className?.replace(/language-/, "");
      return <CodeBlock language={language}>{children}</CodeBlock>;
    },
    h1: ({ children }) => <Heading as="h1">{children}</Heading>,
    h2: ({ children }) => <Heading as="h2">{children}</Heading>,
    h3: ({ children }) => <Heading as="h3">{children}</Heading>,
    h4: ({ children }) => <Heading as="h4">{children}</Heading>,
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    blockquote: ({ children }) => {
      const calloutHandlers: CalloutTypeHandlers = {
        WARNING: ({ title, children }) => (
          <Callout variant="warning" title={title}>
            {children}
          </Callout>
        ),
      };
      return <Blockquote callouts={calloutHandlers}>{children}</Blockquote>;
    },
    a: ({ href, children }) => (
      <ExternalLink href={href}>{children}</ExternalLink>
    ),
    ImageCarousel,
    ImageCarouselItem,
    ...components,
  };
}
