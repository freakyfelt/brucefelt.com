import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Link, ExternalLink } from "./Link";

describe("Link", () => {
  it("renders an internal link correctly", () => {
    render(<Link path="/test">Test Link</Link>);
    const link = screen.getByRole("link", { name: /test link/i });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies variant classes correctly", () => {
    render(
      <Link path="/test" variant="nav">
        Nav Link
      </Link>,
    );
    const link = screen.getByRole("link", { name: /nav link/i });
    expect(link).toHaveClass("text-foreground/60");
  });

  it("applies custom className", () => {
    render(
      <Link path="/test" className="custom-class">
        Custom Class Link
      </Link>,
    );
    const link = screen.getByRole("link", { name: /custom class link/i });
    expect(link).toHaveClass("custom-class");
  });

  it("throws an error when an absolute URL is provided", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<Link path="https://example.com">Absolute Link</Link>),
    ).toThrow(
      "Link should not be used for absolute URLs: https://example.com. Use ExternalLink instead.",
    );
    consoleSpy.mockRestore();
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
