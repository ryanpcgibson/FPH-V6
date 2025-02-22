import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DATE_FORMATS = {
  /** Format for API and database (YYYY-MM-DD) */
  ISO: "yyyy-MM-dd",
  /** Format for US user display (MM/DD/YYYY) */
  US: "MM/dd/yyyy",
  /** Placeholder text shown to users */
  PLACEHOLDER: "MM/DD/YYYY",
} as const;

/**
 * Convert a Date to ISO date string (YYYY-MM-DD)
 * Used for HTML date inputs and API/database interactions
 */
export const toISODateString = (
  date: Date | null | undefined
): string | null => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

/**
 * Parse an ISO date string (YYYY-MM-DD) to Date
 */
export const fromISODateString = (
  dateStr: string | null | undefined
): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  // Check if date is valid
  return isNaN(date.getTime()) ? null : date;
};
