import { test, expect } from "@playwright/test";

/**
 * Theme Toggle Test Suite
 *
 * Tests cover:
 * - Theme toggle functionality (light/dark/system)
 * - Theme persistence across navigation
 */

test.describe("Theme Toggle", () => {
  test("should toggle theme from light to dark", async ({ page }) => {
    await page.goto("/");

    // Find theme toggle button
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });
    await expect(themeToggle).toBeVisible();

    // Click to open dropdown
    await themeToggle.click();

    // Select dark theme
    const darkOption = page.getByRole("menuitem", { name: "Dark" });
    await expect(darkOption).toBeVisible();
    await darkOption.click();

    // Verify dark theme is applied (check for dark class on html element)
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test("should toggle theme from dark to light", async ({ page }) => {
    await page.goto("/");

    // Set theme to dark first
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });
    await themeToggle.click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // Wait a moment for theme to apply
    await page.waitForTimeout(100);

    // Toggle back to light
    await themeToggle.click();
    await page.getByRole("menuitem", { name: "Light" }).click();

    // Verify light theme is applied (dark class should be removed)
    const htmlElement = page.locator("html");
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test("should have system theme option", async ({ page }) => {
    await page.goto("/");

    // Open theme dropdown
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });
    await themeToggle.click();

    // Verify system option exists
    const systemOption = page.getByRole("menuitem", { name: "System" });
    await expect(systemOption).toBeVisible();
  });

  test("theme should persist across page navigation", async ({ page }) => {
    await page.goto("/");

    // Set dark theme
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });
    await themeToggle.click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // Navigate to another page
    await page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/.*\/about/);

    // Verify dark theme persists
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
