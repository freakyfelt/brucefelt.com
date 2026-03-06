import { test, expect } from "@playwright/test";

/**
 * Blog Page Test Suite
 *
 * Tests cover:
 * - Blog page layout and content verification
 */

test.describe("Blog Page Layout", () => {
  test("should redirect /posts to /blog/posts", async ({ page }) => {
    const response = await page.goto("/posts");

    // Verify redirect occurred
    await expect(page).toHaveURL(/.*\/blog\/posts/);

    // Verify successful response
    expect(response?.status()).toBe(200);
  });

  test("should display blog content structure", async ({ page }) => {
    await page.goto("/blog/posts");

    // The page should have article or main content
    // Use getByRole('main') and be specific if there are multiple
    const main = page
      .getByRole("main")
      .filter({ has: page.getByRole("heading", { name: "Blog Posts" }) });
    await expect(main).toBeVisible();
  });
});
