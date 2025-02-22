/**
 * Generates a random, unique identifier string suitable for testing
 * @param prefix Optional prefix (e.g., 'pet-', 'loc-')
 * @returns A string like 'pet-x7k9v2' or 'loc-m3n8p4'
 */
export const generateTestId = (prefix?: string) => {
  const randomString = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${randomString}` : randomString;
};

// Example usage:
// generateTestId('pet')  -> "pet-x7k9v2"
// generateTestId('loc')  -> "loc-m3n8p4"
// generateTestId()       -> "x7k9v2"

/**
 * Generate a random date within a specified range
 * @param start - Start of date range
 * @param end - End of date range
 * @returns Random date between start and end
 */
const randDateBetween = (start: Date, end: Date): Date => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
};

/**
 * Generate a random date, by default within the last 10 years
 * @param yearsBack - How many years back to consider (default: 10)
 * @returns Random date
 */
export const randDate = (yearsBack: number = 10): Date => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - yearsBack);
  return randDateBetween(start, end);
};

/**
 * Generate a random date before the specified date
 * @param date - The reference date
 * @param gapYears - Maximum years before the date (default: 10)
 * @returns Random date before the reference date
 */
export const randDateBefore = (date: Date, gapYears: number = 10): Date => {
  const end = new Date(date);
  const start = new Date(date);
  start.setFullYear(end.getFullYear() - gapYears);
  return randDateBetween(start, end);
};

/**
 * Generate a random date after the specified date
 * @param date - The reference date
 * @param gapYears - Maximum years after the date (default: 10)
 * @returns Random date after the reference date
 */
export const randDateAfter = (date: Date, gapYears: number = 10): Date => {
  const start = new Date(date);
  const end = new Date(date);
  end.setFullYear(start.getFullYear() + gapYears);
  return randDateBetween(start, end);
};

// Example usage:
// const randomDate = randDate();  // Random date within last 10 years
// const beforeDate = randDateBefore(new Date('2024-01-01')); // Random date before 2024
// const afterDate = randDateAfter(new Date('2020-01-01')); // Random date after 2020
