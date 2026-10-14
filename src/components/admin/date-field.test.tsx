import { CoreAdminContext, memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import { render } from "vitest-browser-react";
import { commands } from "vitest/browser";
import { DateField } from "./date-field";

const frenchI18n = polyglotI18nProvider(() => frenchMessages, "fr");

describe("DateField French defaults", () => {
  it("uses the app locale on an English browser and preserves date-only days", async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      await commands.setTimezone("America/New_York");
      const screen = await render(
        <CoreAdminContext i18nProvider={frenchI18n} store={memoryStore()}>
          <DateField source="date" record={{ id: 1, date: "2024-01-05" }} />
        </CoreAdminContext>,
      );
      await expect.element(screen.getByText("05/01/2024")).toBeVisible();
    } finally {
      await commands.setTimezone(timezone);
    }
  });

  it("keeps explicit formatting options working", async () => {
    const screen = await render(
      <CoreAdminContext i18nProvider={frenchI18n} store={memoryStore()}>
        <DateField
          source="date"
          record={{ id: 1, date: "2024-01-05" }}
          options={{ day: "numeric", month: "long", year: "numeric" }}
        />
      </CoreAdminContext>,
    );
    await expect.element(screen.getByText("5 janvier 2024")).toBeVisible();
  });

  it("preserves Intl dateStyle overrides", async () => {
    const screen = await render(
      <CoreAdminContext i18nProvider={frenchI18n} store={memoryStore()}>
        <DateField
          source="date"
          record={{ id: 1, date: "2024-01-05" }}
          options={{ dateStyle: "long" }}
        />
      </CoreAdminContext>,
    );
    await expect.element(screen.getByText("5 janvier 2024")).toBeVisible();
  });
});
