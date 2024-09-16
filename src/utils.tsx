import { format, parseISO } from "date-fns";

export const formatDateForDisplay = (
  date: string | Date | undefined
): string => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? parseISO(date) : date;

  // Get the user's locale
  const userLocale = navigator.language || "en-US";

  // Determine the date format based on locale
  const dateFormat = userLocale.startsWith("en") ? "MM-dd-yyyy" : "dd-MM-yyyy";

  return format(parsedDate, dateFormat);
};
