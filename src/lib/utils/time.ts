/**
 * Detects the browser locale or falls back to en-US.
 */
function getLocale(): string {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return "en-US";
}

const TIME_UNITS = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
} as const;

const TIME_UNITS_ENTRIES = Object.entries(TIME_UNITS) as [
  keyof typeof TIME_UNITS,
  number,
][];

/**
 * Formats an ISO8601 date string into a localized long date format.
 * Example: "2025-08-24T00:00:00Z" -> "August 24, 2025" (en-US)
 */
export function formatDate(isoString: string, locale?: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return isoString;
  }

  return new Intl.DateTimeFormat(locale || getLocale(), {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Formats an ISO8601 date string into a localized relative time string.
 * Example: "2025-12-23T12:00:00Z" -> "2 days ago" (if today is 2025-12-25)
 * If the span is larger than 1 year, it reverts to absolute date formatting.
 */
export function formatRelativeTime(
  isoString: string,
  locale?: string,
  from: Date = new Date(),
): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return isoString;
  }

  const diffInSeconds = Math.floor((date.getTime() - from.getTime()) / 1000);

  // Revert to absolute date if span is larger than 1 year
  if (Math.abs(diffInSeconds) >= TIME_UNITS.year) {
    return formatDate(isoString, locale);
  }

  const rtf = new Intl.RelativeTimeFormat(locale || getLocale(), {
    numeric: "auto",
  });

  for (const [unit, seconds] of TIME_UNITS_ENTRIES) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      const value = Math.round(diffInSeconds / seconds);
      return rtf.format(value, unit);
    }
  }

  return isoString;
}
