import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Time } from "./Time";

describe("Time", () => {
  it("renders the formatted date correctly in a time tag", () => {
    const testTimestamp = "2024-01-01T12:00:00Z";
    render(<Time dateTime={testTimestamp} />);

    // "January 1, 2024" is the expected output for en-US
    const timeElement = screen.getByText(/January 1, 2024/);
    expect(timeElement.tagName).toBe("TIME");
    expect(timeElement).toHaveAttribute("dateTime", testTimestamp);
  });

  it("renders relative time when variant is 'relative'", () => {
    const now = new Date("2025-12-25T12:00:00Z");
    const testTimestamp = "2025-12-23T12:00:00Z";
    render(<Time dateTime={testTimestamp} variant="relative" from={now} />);

    expect(screen.getByText("2 days ago")).toBeDefined();
  });

  it("applies custom className", () => {
    const testTimestamp = "2024-01-01T12:00:00Z";
    const testClass = "text-red-500";
    render(<Time dateTime={testTimestamp} className={testClass} />);

    const timeElement = screen.getByText(/January 1, 2024/);
    expect(timeElement).toHaveClass(testClass);
  });
});
