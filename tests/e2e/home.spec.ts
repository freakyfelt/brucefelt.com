import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "./utils/viewports";

/**
 * Home Page Test Suite
 *
 * Tests cover:
 * - Home page layout and content verification
 * - Responsiveness (no horizontal scrolling on mobile)
 */

test.describe("Home Page Layout", () => {
  test("should display key sections on desktop", async ({ page }) => {
    await page.goto("/");

    // Verify welcome message
    await expect(
      page.getByText("Welcome to the overhauled website"),
    ).toBeVisible();

    // Verify Recent Posts section
    const recentPostsHeading = page.getByRole("heading", {
      name: "Recent Posts",
    });
    await expect(recentPostsHeading).toBeVisible();

    // Verify Personal Projects section
    const projectsHeading = page.getByRole("heading", {
      name: "Personal Projects",
    });
    await expect(projectsHeading).toBeVisible();
  });

  test("should display key sections on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto("/");

    // Verify sections are still visible on mobile
    await expect(
      page.getByText("Welcome to the overhauled website"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Recent Posts" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Personal Projects" }),
    ).toBeVisible();
  });
});

test.describe("Responsiveness for Home", () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`should not have horizontal scroll on ${name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");

      // Check for horizontal scrollbar by comparing scroll width to client width
      const hasHorizontalScroll = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  }
});
