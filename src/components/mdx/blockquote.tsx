import React from "react";
import { CalloutTypeHandlers, maybeParseCallout } from "./callout";

type BlockquoteProps = {
  children: React.ReactNode;
  callouts?: CalloutTypeHandlers;
  className?: string;
};

/** parses a blockquote from MDX and detects any special rendering properties, otherwise returns a blockquote */
export function Blockquote({
  children,
  callouts = {},
  className,
}: BlockquoteProps) {
  const callout = maybeParseCallout({
    children,
    handlers: callouts,
  });

  if (callout) {
    return callout;
  }
  return <blockquote className={className}>{children}</blockquote>;
}
