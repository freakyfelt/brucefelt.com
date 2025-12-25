import { describe, it, expect } from "vitest";
import { formatDate, formatRelativeTime } from "./time";

describe("time utils", () => {
  describe("formatDate", () => {
    it("formats ISO string to localized date", () => {
      const iso = "2025-08-24T12:00:00Z";
      expect(formatDate(iso, "en-US")).toBe("August 24, 2025");
    });

    it("uses default locale if none provided", () => {
      const iso = "2025-08-24T12:00:00Z";
      // In test environment, default is usually en-US
      expect(formatDate(iso)).toMatch(/August 24, 2025/);
    });

    it("returns original string if invalid date", () => {
      expect(formatDate("invalid-date")).toBe("invalid-date");
    });
  });

  describe("formatRelativeTime", () => {
    const now = new Date("2025-12-25T12:00:00Z");

    it("formats relative time for days ago", () => {
      const iso = "2025-12-23T12:00:00Z";
      expect(formatRelativeTime(iso, "en-US", now)).toBe("2 days ago");
    });

    it("uses default locale if none provided", () => {
      const iso = "2025-12-23T12:00:00Z";
      expect(formatRelativeTime(iso, undefined, now)).toBe("2 days ago");
    });

    it("formats relative time for future days", () => {
      const iso = "2025-12-27T12:00:00Z";
      expect(formatRelativeTime(iso, "en-US", now)).toBe("in 2 days");
    });

    it("formats relative time for yesterday", () => {
      const iso = "2025-12-24T12:00:00Z";
      expect(formatRelativeTime(iso, "en-US", now)).toBe("yesterday");
    });

    it("formats relative time for tomorrow", () => {
      const iso = "2025-12-26T12:00:00Z";
      expect(formatRelativeTime(iso, "en-US", now)).toBe("tomorrow");
    });

    it("formats relative time for hours", () => {
      const iso = "2025-12-25T10:00:00Z";
      expect(formatRelativeTime(iso, "en-US", now)).toBe("2 hours ago");
    });

    it("reverts to absolute date for spans larger than 1 year", () => {
      const iso = "2024-12-24T12:00:00Z"; // 1 year and 1 day ago
      expect(formatRelativeTime(iso, "en-US", now)).toBe("December 24, 2024");
    });

    it("returns original string if invalid date", () => {
      expect(formatRelativeTime("invalid-date", "en-US", now)).toBe(
        "invalid-date",
      );
    });

    it("detects navigator.language if available", () => {
      const iso = "2025-12-23T12:00:00Z";
      // Mock navigator
      const originalNavigator = global.navigator;
      // @ts-expect-error - mocking navigator
      global.navigator = { language: "de-DE" };

      // In German, "2 days ago" with numeric: "auto" is "vorgestern"
      expect(formatRelativeTime(iso, undefined, now)).toBe("vorgestern");

      // Restore navigator
      global.navigator = originalNavigator;
    });
  });
});
