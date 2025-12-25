import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DateTime } from "./DateTime";

describe("DateTime", () => {
    it("renders the timestamp correctly in a time tag", () => {
        const testTimestamp = "2024-01-01T12:00:00Z";
        render(<DateTime timestamp={testTimestamp} />);

        const timeElement = screen.getByText(testTimestamp);
        expect(timeElement.tagName).toBe("TIME");
        expect(timeElement).toHaveAttribute("dateTime", testTimestamp);
    });

    it("applies custom className", () => {
        const testTimestamp = "2024-01-01T12:00:00Z";
        const testClass = "text-red-500";
        render(<DateTime timestamp={testTimestamp} className={testClass} />);

        const timeElement = screen.getByText(testTimestamp);
        expect(timeElement).toHaveClass(testClass);
    });
});
