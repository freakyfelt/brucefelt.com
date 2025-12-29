import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Callout } from "./Callout";

describe("AlertBanner", () => {
  it("renders info variant by default", () => {
    render(<Callout>Info message</Callout>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-blue-500/50");
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    render(<Callout variant="warning">Warning message</Callout>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-yellow-500/50");
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("renders with a title", () => {
    render(<Callout title="Alert Title">Message</Callout>);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });
});
