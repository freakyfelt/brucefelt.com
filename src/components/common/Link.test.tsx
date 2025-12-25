import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StyledLink, ExternalLink } from "./Link";

describe("StyledLink", () => {
  it("renders an internal link correctly", () => {
    render(<StyledLink href="/test">Test Link</StyledLink>);
    const link = screen.getByRole("link", { name: /test link/i });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies variant classes correctly", () => {
    render(
      <StyledLink href="/test" variant="nav">
        Nav Link
      </StyledLink>,
    );
    const link = screen.getByRole("link", { name: /nav link/i });
    expect(link).toHaveClass("text-foreground/60");
  });

  it("applies custom className", () => {
    render(
      <StyledLink href="/test" className="custom-class">
        Custom Class Link
      </StyledLink>,
    );
    const link = screen.getByRole("link", { name: /custom class link/i });
    expect(link).toHaveClass("custom-class");
  });
});

describe("ExternalLink", () => {
  it("renders an external link with correct attributes", () => {
    render(
      <ExternalLink href="https://example.com">External Link</ExternalLink>,
    );
    const link = screen.getByRole("link", { name: /external link/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies variant classes correctly", () => {
    render(
      <ExternalLink href="https://example.com" variant="nav">
        Nav Link
      </ExternalLink>,
    );
    const link = screen.getByRole("link", { name: /nav link/i });
    expect(link).toHaveClass("text-foreground/60");
  });

  it("applies custom className", () => {
    render(
      <ExternalLink href="https://example.com" className="custom-class">
        Custom Class Link
      </ExternalLink>,
    );
    const link = screen.getByRole("link", { name: /custom class link/i });
    expect(link).toHaveClass("custom-class");
  });
});
