import type { HTMLAttributes } from "react";
import {
  genericMemo,
  useFieldValue,
  useLocaleState,
  useTranslate,
} from "ra-core";

import type { FieldProps } from "@/lib/field.type";

const DateFieldImpl = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RecordType extends Record<string, any> = Record<string, any>,
>(
  inProps: DateFieldProps<RecordType>,
) => {
  const {
    empty,
    locales,
    options,
    showTime = false,
    showDate = true,
    transform = defaultTransform,
    source,
    record,
    defaultValue,
    ...rest
  } = inProps;
  const translate = useTranslate();
  const [locale = "fr"] = useLocaleState();
  const fieldLocales = locales ?? locale;

  if (!showTime && !showDate) {
    throw new Error(
      "<DateField> cannot have showTime and showDate false at the same time",
    );
  }

  const value = useFieldValue({ source, record, defaultValue });
  if (value == null || value === "") {
    if (!empty) {
      return null;
    }

    return (
      <span {...rest}>
        {typeof empty === "string" ? translate(empty, { _: empty }) : empty}
      </span>
    );
  }

  const date = transform(value);
  const dateOptions: Intl.DateTimeFormatOptions = {
    ...(options === undefined
      ? ({ year: "numeric", month: "2-digit", day: "2-digit" } as const)
      : {}),
    // Date-only values must keep their calendar day across timezones.
    ...(typeof value === "string" && value.length <= 10
      ? { timeZone: "UTC" }
      : {}),
    ...options,
  };

  let dateString = "";
  if (date) {
    if (showTime && showDate) {
      dateString = toLocaleStringSupportsLocales
        ? date.toLocaleString(
            fieldLocales,
            options ?? {
              ...dateOptions,
              hour: "2-digit",
              minute: "2-digit",
            },
          )
        : date.toLocaleString();
    } else if (showDate) {
      // If input is a date string (e.g. '2022-02-15') without time and time zone,
      // force timezone to UTC to fix issue with people in negative time zones
      // who may see a different date when calling toLocaleDateString().
      dateString = toLocaleStringSupportsLocales
        ? date.toLocaleDateString(fieldLocales, dateOptions)
        : date.toLocaleDateString();
    } else if (showTime) {
      dateString = toLocaleStringSupportsLocales
        ? date.toLocaleTimeString(fieldLocales, options)
        : date.toLocaleTimeString();
    }
  }

  return <span {...rest}>{dateString}</span>;
};
DateFieldImpl.displayName = "DateFieldImpl";

/**
 * Displays a date value with locale-specific formatting.
 *
 * This field automatically formats dates according to the user's locale using Intl.DateTimeFormat.
 * It supports showing date only, time only, or both, with custom locales and formatting options.
 * To be used with RecordField or DataTable.Col components, or anywhere a RecordContext is available.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/datefield/ DateField documentation}
 *
 * @example
 * import {
 *   List,
 *   DataTable,
 *   DateField,
 * } from '@/components/admin';
 *
 * const PostList = () => (
 *   <List>
 *     <DataTable>
 *       <DataTable.Col source="title" />
 *       <DataTable.Col>
 *         <DateField source="published_at" />
 *       </DataTable.Col>
 *       <DataTable.Col>
 *         <DateField source="updated_at" showTime />
 *       </DataTable.Col>
 *     </DataTable>
 *   </List>
 * );
 */
export const DateField = genericMemo(DateFieldImpl);

export interface DateFieldProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RecordType extends Record<string, any> = Record<string, any>,
>
  extends FieldProps<RecordType>, HTMLAttributes<HTMLSpanElement> {
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
  showTime?: boolean;
  showDate?: boolean;
  transform?: (value: unknown) => Date;
}

const defaultTransform = (value: unknown) =>
  value instanceof Date
    ? value
    : typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : undefined;

const toLocaleStringSupportsLocales = (() => {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  try {
    new Date().toLocaleString("i");
  } catch (error) {
    return error instanceof RangeError;
  }
  return false;
})();
