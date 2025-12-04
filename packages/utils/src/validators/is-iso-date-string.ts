export function isISODateString(date: string) {
  try {
    const convertedDate = new Date(date).toISOString();

    return convertedDate === date;
  } catch (_) {
    return false;
  }
}
