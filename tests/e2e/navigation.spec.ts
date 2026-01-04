import { test, expect } from "@playwright/test";
import { SPECIFIC_VIEWPORTS } from "./utils/viewports";

/**
 * Navigation Test Suite
 *
 * Tests cover:
 * - Desktop navigation
 * - Mobile navigation
 * - Cross-page navigation
 */

test.describe("Desktop Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(SPECIFIC_VIEWPORTS.DESKTOP);
  });

  test("should display navigation links on desktop", async ({ page }) => {
    await page.goto("/");

    // Verify navigation is visible
    const nav = page.getByRole("navigation", { name: "Main Navigation" });
    await expect(nav).toBeVisible();

    // Verify main navigation links are visible
    const blogLink = nav.getByRole("link", { name: "Blog" });
    const aboutLink = nav.getByRole("link", { name: "About" });

    await expect(blogLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
  });

  test("should navigate to Blog page from navigation", async ({ page }) => {
    await page.goto("/");

    // Click Blog link in main nav
    await page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "Blog" })
      .click();

    // Verify navigation to blog posts page
    await expect(page).toHaveURL(/.*\/blog\/posts/);
  });

  test("should navigate to About page from navigation", async ({ page }) => {
    await page.goto("/");

    // Click About link in main nav
    await page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "About" })
      .click();

    // Verify navigation to about page
    await expect(page).toHaveURL(/.*\/about/);
  });

  test("should display site branding/logo", async ({ page }) => {
    await page.goto("/");

    // Verify site title/logo is visible
    // The logo is a link with aria-label="Home" in the header
    const homeLink = page.locator("header").getByRole("link", { name: "Home" });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toContainText("The Felt Facade");
  });
});

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 viewport
  });

  test("should display navigation on mobile", async ({ page }) => {
    await page.goto("/");

    // Since the navbar doesn't have a hamburger menu, verify links are still accessible
    const nav = page.getByRole("navigation", { name: "Main Navigation" });
    await expect(nav).toBeVisible();
  });

  test("should be able to navigate on mobile", async ({ page }) => {
    await page.goto("/");

    // Verify navigation links work on mobile
    const nav = page.getByRole("navigation", { name: "Main Navigation" });
    const blogLink = nav.getByRole("link", { name: "Blog" });
    await expect(blogLink).toBeVisible();

    await blogLink.click();
    await expect(page).toHaveURL(/.*\/blog\/posts/);
  });
});

test.describe("Cross-Page Navigation", () => {
  test("should navigate between all main pages", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Go to About
    await page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/.*\/about/);

    // Go to Blog
    await page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "Blog" })
      .click();
    await expect(page).toHaveURL(/.*\/blog\/posts/);

    // Go back to Home via logo/site title in header
    await page.locator("header").getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("should maintain navbar across all pages", async ({ page }) => {
    const pages = ["/", "/about", "/blog/posts"];

    for (const path of pages) {
      await page.goto(path);

      // Verify navbar is present
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Verify nav links are present
      const nav = page.getByRole("navigation", { name: "Main Navigation" });
      await expect(nav).toBeVisible();

      // Verify theme toggle is present
      const themeToggle = page.getByRole("button", { name: "Toggle theme" });
      await expect(themeToggle).toBeVisible();
    }
  });
});
