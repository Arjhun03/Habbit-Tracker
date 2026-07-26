/**
 * Get date string formatted as YYYY-MM-DD for a given date object (defaults to today)
 */
export const getFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date string for yesterday formatted as YYYY-MM-DD
 */
export const getYesterdayFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return getFormattedDate(d);
};
