/** Year-month string in the form `YYYY-MM`, as used in content files. */
export type YearMonth = string;

export const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value: YearMonth): { year: number; month: number } {
  if (!YEAR_MONTH.test(value)) throw new Error(`Invalid year-month "${value}", expected YYYY-MM`);
  const [year, month] = value.split('-').map(Number) as [number, number];
  return { year, month };
}

/** Fractional year at the start of the month: 2025-01 → 2025.0, 2025-07 → 2025.5. */
export function toDecimalYear(value: YearMonth): number {
  const { year, month } = parseYearMonth(value);
  return year + (month - 1) / 12;
}

/** Fractional year at the end of the month: 2025-12 → 2026.0. */
export function toDecimalYearEnd(value: YearMonth): number {
  return toDecimalYear(value) + 1 / 12;
}

export function formatYearMonth(value: YearMonth, locale: string): string {
  const { year, month } = parseYearMonth(value);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

/** Whole months between two year-months, both inclusive. */
export function monthsBetween(start: YearMonth, end: YearMonth): number {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  return (b.year - a.year) * 12 + (b.month - a.month) + 1;
}
