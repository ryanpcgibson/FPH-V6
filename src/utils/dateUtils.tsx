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

export const convertStringToDate = (
  dateString: string | undefined
): Date | undefined => {
  return dateString ? new Date(dateString) : undefined;
};

export const convertDateToISODateString = (
  date: Date | undefined
): String | undefined => {
  if (!date) {
    return undefined;
  } else {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};
