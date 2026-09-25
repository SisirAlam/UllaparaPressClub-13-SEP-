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
 * Converts Bengali digits to English ASCII digits
 */
export function toEnglishNumber(str: string): string {
  if (!str) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.split(banglaDigits[i]).join(i.toString());
  }
  return result;
}

/**
 * Normalizes OTP input by converting Bengali numerals to English,
 * removing whitespace, dashes, and other non-numeric symbols.
 */
export function normalizeOtp(otp: string): string {
  if (!otp) return '';
  const english = toEnglishNumber(otp);
  return english.replace(/[^0-9]/g, '').trim();
}

/**
 * Cleans phone number by converting Bengali numerals to English,
 * removing spaces, hyphens, and leading country code prefix if present.
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  const english = toEnglishNumber(phone);
  let cleaned = english.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Validates if string is a valid 11-digit Bangladeshi mobile number
 * (Starts with 013, 014, 015, 016, 017, 018, 019)
 */
export function isValidBangladeshiPhone(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  return /^01[3-9]\d{8}$/.test(cleaned);
}

/**
 * Pads numbers with leading zero and converts to Bengali
 */
export function formatBengaliTimerNumber(num: number): string {
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toBengaliNumber(padded);
}

