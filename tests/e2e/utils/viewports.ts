/**
 * Centralized viewport configurations for Playwright E2E tests
 *
 * These viewports represent common device sizes used for responsive testing.
 */

/**
 * Standard viewport configurations for responsive testing
 */
export const VIEWPORTS: Record<string, { width: number; height: number }> = {
  "Mobile Small": { width: 320, height: 568 }, // iPhone SE
  "Mobile Medium": { width: 375, height: 667 }, // iPhone 8
  Tablet: { width: 768, height: 1024 }, // iPad
  Desktop: { width: 1280, height: 720 }, // Standard desktop
};

/**
 * Specific viewport configurations for individual test scenarios
 */
export const SPECIFIC_VIEWPORTS = {
  /** iPhone 12 (390x844) - Used for mobile navigation testing */
  IPHONE_12: { width: 390, height: 844 },
  /** Standard desktop viewport - Used for desktop layout testing */
  DESKTOP: { width: 1280, height: 720 },
} as const;
