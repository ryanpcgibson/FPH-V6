import { format, parseISO } from "date-fns";

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

export const prepareDateForDB = (date: Date | undefined): string | null => {
  if (!date) {
    return null;
  }
  return convertDateToISODateString(date) as string;
};
