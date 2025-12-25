import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StyledLink } from "./StyledLink";

describe("StyledLink", () => {
  it("renders an internal link correctly", () => {
    render(<StyledLink href="/test">Test Link</StyledLink>);
    const link = screen.getByRole("link", { name: /test link/i });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders an external link with correct attributes", () => {
    render(<StyledLink href="https://example.com">External Link</StyledLink>);
    const link = screen.getByRole("link", { name: /external link/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders an external link when 'external' prop is true", () => {
    render(
      <StyledLink href="/test" external>
        External Prop Link
      </StyledLink>,
    );
    const link = screen.getByRole("link", { name: /external prop link/i });
    expect(link).toHaveAttribute("target", "_blank");
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
