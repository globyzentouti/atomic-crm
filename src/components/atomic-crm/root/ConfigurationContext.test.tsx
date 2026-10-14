import { CoreAdminContext, memoryStore } from "ra-core";
import { render } from "vitest-browser-react";
import { NumberField } from "@/components/admin/number-field";
import {
  CONFIGURATION_STORE_KEY,
  useConfigurationContext,
} from "./ConfigurationContext";
import { defaultConfiguration } from "./defaultConfiguration";

const Amount = () => {
  const { currency } = useConfigurationContext();
  return (
    <NumberField
      source="amount"
      record={{ id: 1, amount: 1234.5 }}
      locales="fr"
      options={{ style: "currency", currency }}
    />
  );
};

describe("CRM currency defaults", () => {
  it("renders MAD using French number conventions without converting the amount", async () => {
    const screen = await render(
      <CoreAdminContext store={memoryStore()}>
        <Amount />
      </CoreAdminContext>,
    );
    await expect.element(screen.getByText(/1\s234,50\sMAD/)).toBeVisible();
  });

  it("preserves explicit administrator configuration", async () => {
    const store = memoryStore();
    store.setItem(CONFIGURATION_STORE_KEY, {
      ...defaultConfiguration,
      currency: "EUR",
    });
    const screen = await render(
      <CoreAdminContext store={store}>
        <Amount />
      </CoreAdminContext>,
    );
    await expect.element(screen.getByText(/1\s234,50\s€/)).toBeVisible();
  });
});
