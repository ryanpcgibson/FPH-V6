export const calculateYearScrollPosition = (
  year: number,
  columnHeaders: number[],
  cellWidth: number = 80
): number => {
  const yearIndex = columnHeaders.findIndex((header) => header === year);
  if (yearIndex === -1) {
    // If year not found, scroll to the last year
    return (columnHeaders.length - 1) * cellWidth;
  }
  return yearIndex * cellWidth;
};
