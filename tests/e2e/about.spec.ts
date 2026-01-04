import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "./utils/viewports";

/**
 * About Page Test Suite
 *
 * Tests cover:
 * - About page layout and content verification
 * - Responsiveness (no horizontal scrolling on mobile)
 */

test.describe("About Page Layout", () => {
  test("should display main content on About page", async ({ page }) => {
    await page.goto("/about");

    // Verify main heading
    const heading = page.getByRole("heading", { name: "About Me", level: 1 });
    await expect(heading).toBeVisible();

    // Verify content sections exist
    // Use a regex that is more flexible with apostrophes
    await expect(
      page.getByText(/I.m Bruce, a software engineer/),
    ).toBeVisible();

    // Verify "Job Opportunities" section
    const jobSection = page.getByRole("heading", { name: "Job Opportunities" });
    await expect(jobSection).toBeVisible();

    // Verify social links (GitHub, LinkedIn)
    // Use getByRole('main') to avoid footer links
    const main = page.getByRole("main");
    const githubLink = main.getByRole("link", { name: "GitHub", exact: true });
    const linkedinLink = main.getByRole("link", {
      name: "LinkedIn",
      exact: true,
    });
    await expect(githubLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();
  });

  test("should display image on About page", async ({ page }) => {
    await page.goto("/about");

    // Verify image is present (self-portrait)
    const image = page.locator("aside img");
    await expect(image).toBeVisible();
  });
});

test.describe("Responsiveness for About", () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`should render About page without horizontal scroll on ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/about");

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
