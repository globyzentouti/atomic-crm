import { commands } from "vitest/browser";
import { formatLocalizedDate, formatRelativeDate } from "./RelativeDate";

describe("French date display", () => {
  let originalTimezone: string;

  beforeEach(() => {
    originalTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  afterEach(async () => {
    await commands.setTimezone(originalTimezone);
    vi.useRealTimers();
  });

  it("pads dates and preserves date-only values in opposite timezones", async () => {
    for (const timezone of ["America/New_York", "Asia/Tokyo"]) {
      await commands.setTimezone(timezone);
      expect(formatLocalizedDate("2024-01-05")).toBe("05/01/2024");
    }
  });

  it("keeps recent activity relative in French and older dates numeric", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 13, 12));
    expect(
      formatRelativeDate(new Date(2026, 9, 12, 12).toISOString()),
    ).toContain("hier");
    expect(formatRelativeDate(new Date(2026, 9, 1, 12).toISOString())).toBe(
      "01/10/2026",
    );
  });
});
