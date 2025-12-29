import { describe, it, expect, beforeEach } from "vitest";
import * as runtime from "react/jsx-runtime";
import { evaluateSync } from "@mdx-js/mdx";
import React from "react";
import { maybeParseCallout, CalloutTypeHandlers } from "./callout";
import { render, screen } from "@testing-library/react";

describe("maybeParseCallout", () => {
  let handlers: CalloutTypeHandlers;

  beforeEach(() => {
    handlers = {
      INFO: ({ title, children }) => (
        <div data-testid="alert-info">
          {title && <div data-testid="alert-title">{title}</div>}
          <div data-testid="children">{children}</div>
        </div>
      ),
      WARNING: ({ title, children }) => (
        <div data-testid="alert-warning">
          {title && <div data-testid="alert-title">{title}</div>}
          <div data-testid="children">{children}</div>
        </div>
      ),
    };
  });

  const parseAndRender = (content: string) => {
    const trimmed = content
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
    const { default: MDXContent } = evaluateSync(trimmed, {
      ...runtime,
      development: false,
    });

    let result: React.ReactNode = null;
    render(
      <MDXContent
        components={{
          blockquote: ({ children }) => {
            result = maybeParseCallout({ handlers, children });
            return null;
          },
        }}
      />,
    );

    if (result) {
      render(<div data-testid="callout-root">{result}</div>);
    }

    return result;
  };

  it("returns null if no callout tag is found", () => {
    const result = parseAndRender("> This is a normal blockquote");
    expect(result).toBeNull();
    expect(screen.queryByTestId("callout-root")).toBeNull();
  });

  it("parses a basic callout without title", () => {
    parseAndRender(`
    > [!WARNING]
    > 
    > This is the body
    `);

    expect(screen.getByTestId("alert-warning")).toBeDefined();
    expect(screen.queryByTestId("alert-title")).toBeNull();
    expect(screen.getByTestId("children")).toHaveTextContent(
      "This is the body",
    );
  });

  it("returns null for inline titles", () => {
    const result = parseAndRender(`
    > [!WARNING] Important Title
    `);
    expect(result).toBeNull();
  });

  it("parses a callout with title on the next line", () => {
    parseAndRender(`
    > [!WARNING]
    > My Title
    >
    > The body
    `);

    expect(screen.getByTestId("alert-warning")).toBeDefined();
    expect(screen.getByTestId("alert-title")).toHaveTextContent("My Title");
    expect(screen.getByTestId("children")).toHaveTextContent("The body");
  });

  it("handles leading newlines or whitespace", () => {
    parseAndRender(`
    > 
    > [!INFO]
    > My Title
    >
    > The body
    `);

    expect(screen.getByTestId("alert-info")).toBeDefined();
    expect(screen.getByTestId("alert-title")).toHaveTextContent("My Title");
    expect(screen.getByTestId("children")).toHaveTextContent("The body");
  });

  it("returns null for unknown callout types", () => {
    const result = parseAndRender(`
    > [!UNKNOWN]
    `);

    expect(result).toBeNull();
  });
});
