import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertBanner } from "./AlertBanner";

describe("AlertBanner", () => {
  it("renders info variant by default", () => {
    render(<AlertBanner>Info message</AlertBanner>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-blue-500/50");
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    render(<AlertBanner variant="warning">Warning message</AlertBanner>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-yellow-500/50");
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("renders with a title", () => {
    render(<AlertBanner title="Alert Title">Message</AlertBanner>);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });
});
