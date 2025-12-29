import React from "react";

const CALLOUT_TYPES = ["INFO", "WARNING", "ERROR", "SUCCESS"] as const;

const CALLOUT_REGEXP = new RegExp(
  `^\\s*\\[\\!(${CALLOUT_TYPES.join("|")})\\](?:\\n|$)`,
);

type CalloutType = (typeof CALLOUT_TYPES)[number];

type CalloutHandlerProps = {
  title?: string;
  children: React.ReactNode;
};

export type CalloutTypeHandlers = Partial<
  Record<CalloutType, (props: CalloutHandlerProps) => React.ReactNode>
>;

export type CalloutProps = {
  children: React.ReactNode;
  handlers: CalloutTypeHandlers;
};

/**
 * Checks if the first paragraph child has a callout tag (e.g. [!NOTE]) and, if present, calls the handler with
 * all other children (minus leading newlines)
 *
 * @example
 * > ["\n", { p, " ![NOTE]\nThis is a body" }, "\n", { p, "This is also a body\n" }, "\n" ]
 * > handlers[NOTE]({ title: undefined, children: <><p>This is the body</p></> })
 *
 * @param children
 * @return null if no callout tag is found or no corresponding handler is provided
 */
export const maybeParseCallout = ({
  handlers,
  children,
}: CalloutProps): React.ReactNode | null => {
  const childrenList = React.Children.toArray(children);

  // find first element that is a string and matches the callout regex
  const firstChildIdx = childrenList.findIndex(
    (child) => child !== "\n" && React.isValidElement(child),
  );
  if (firstChildIdx === -1) {
    return null;
  }
  const firstChild = childrenList[firstChildIdx] as React.ReactElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstChildProps = firstChild.props as any;
  const firstChildContent = React.Children.toArray(firstChildProps.children)
    .filter((child): child is string => typeof child === "string")
    .join("");

  if (!firstChildContent) {
    return null;
  }

  const match = firstChildContent.match(CALLOUT_REGEXP);
  if (!match) {
    return null;
  }

  const [, type] = match;
  const handler = handlers[type as CalloutType];

  if (!handler) {
    return null;
  }

  const lines = firstChildContent.split("\n");
  const finalTitle = lines[1]?.trim();
  const bodyContent = lines.slice(2).join("\n").trim();

  const body = [
    ...(bodyContent ? [<p key="first">{bodyContent}</p>] : []),
    ...childrenList.slice(firstChildIdx + 1),
  ];

  return handler({
    title: finalTitle,
    children: <>{body}</>,
  });
};
