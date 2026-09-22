/**
 * Converts English digits to Bengali digits
 */
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

/**
 * Pads numbers with leading zero and converts to Bengali
 */
export function formatBengaliTimerNumber(num: number): string {
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toBengaliNumber(padded);
}
