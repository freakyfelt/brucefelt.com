import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types";
import { Heading } from "../common/Heading";
import { ExternalLink } from "../common/Link";
import { ReactNode } from "react";

interface HyperlinkNode {
  data: {
    uri: string;
  };
}

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (_node: unknown, children: ReactNode) => (
      <Heading as="h1">{children}</Heading>
    ),
    [BLOCKS.HEADING_2]: (_node: unknown, children: ReactNode) => (
      <Heading as="h2">{children}</Heading>
    ),
    [BLOCKS.HEADING_3]: (_node: unknown, children: ReactNode) => (
      <Heading as="h3">{children}</Heading>
    ),
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (_node: unknown, children: ReactNode) => (
      <ul className="list-disc pl-6 mb-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: unknown, children: ReactNode) => (
      <ol className="list-decimal pl-6">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: unknown, children: ReactNode) => (
      <li>{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node: unknown, children: ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node: unknown, children: ReactNode) => {
      const hyperlinkNode = node as HyperlinkNode;
      return (
        <ExternalLink href={hyperlinkNode.data.uri}>{children}</ExternalLink>
      );
    },
  },
};

export type PostContentProps = {
  content: Document;
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="max-w-none">
      {documentToReactComponents(content, options)}
    </div>
  );
}
