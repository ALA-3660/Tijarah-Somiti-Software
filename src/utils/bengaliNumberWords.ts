// TSS Utility: Convert Number to Bengali Currency Words (কথায় রূপান্তর)
// Supports integers and decimals up to Crores (কোটি) with Paisa (পয়সা)

const ONES: { [key: number]: string } = {
  0: 'শূন্য', 1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ', 6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়',
  10: 'দশ', 11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ', 15: 'পনেরো', 16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ',
  20: 'বিশ', 21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'উনত্রিশ',
  30: 'ত্রিশ', 31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ', 36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'উনচল্লিশ',
  40: 'চল্লিশ', 41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ', 46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'উনপঞ্চাশ',
  50: 'পঞ্চাশ', 51: 'একান্ন', 52: 'বায়ান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন', 56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'উনষাট',
  60: 'ষাট', 61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি', 66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'উনসত্তর',
  70: 'সত্তর', 71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর', 76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'উনআশি',
  80: 'আশি', 81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি', 86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'অষ্টআশি', 89: 'উননব্বই',
  90: 'নব্বই', 91: 'একানব্বই', 92: 'বানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই', 96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই'
};

function convertLessThanThousand(n: number): string {
  let result = '';
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    result += (hundreds === 1 ? 'এক শত ' : `${ONES[hundreds]} শত `);
    n %= 100;
  }
  if (n > 0) {
    result += ONES[n] + ' ';
  }
  return result.trim();
}

/**
 * Converts a positive number to Bengali words for financial currency amounts
 * Example: 25000 -> "পঁচিশ হাজার টাকা মাত্র"
 * Example: 150000.50 -> "এক লাখ পঞ্চাশ হাজার টাকা পঞ্চাশ পয়সা মাত্র"
 */
export function numberToBengaliWords(num: number): string {
  if (isNaN(num) || num === null || num === undefined) {
    return 'শূন্য টাকা মাত্র';
  }

  const rounded = Math.round(num * 100) / 100;
  if (rounded === 0) {
    return 'শূন্য টাকা মাত্র';
  }

  const parts = rounded.toFixed(2).split('.');
  let integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);

  let words = '';

  // Crores (কোটি) -> 1,00,00,000
  if (integerPart >= 10000000) {
    const crore = Math.floor(integerPart / 10000000);
    words += (crore < 100 ? ONES[crore] : convertLessThanThousand(crore)) + ' কোটি ';
    integerPart %= 10000000;
  }

  // Lakhs (লাখ) -> 1,00,000
  if (integerPart >= 100000) {
    const lakh = Math.floor(integerPart / 100000);
    words += ONES[lakh] + ' লাখ ';
    integerPart %= 100000;
  }

  // Thousands (হাজার) -> 1,000
  if (integerPart >= 1000) {
    const thousand = Math.floor(integerPart / 1000);
    words += ONES[thousand] + ' হাজার ';
    integerPart %= 1000;
  }

  // Hundreds & Remaining (শত ও একক/দশক)
  if (integerPart > 0) {
    words += convertLessThanThousand(integerPart) + ' ';
  }

  words = words.trim();

  let result = words ? `${words} টাকা` : '';

  if (decimalPart > 0) {
    const paisaWords = ONES[decimalPart] || `${decimalPart}`;
    result += (result ? ' ' : '') + `${paisaWords} পয়সা`;
  }

  return (result ? `${result} মাত্র` : 'শূন্য টাকা মাত্র').trim();
}

/**
 * Formats a number to Bengali digit string (e.g. 12345 -> ১২,৩৪৫.০০)
 */
export function formatToBengaliCurrency(amount: number): string {
  if (isNaN(amount) || amount === null) return '০.০০';
  const enFormatted = Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    ',': ',', '.': '.'
  };

  return enFormatted.split('').map(ch => bnDigits[ch] || ch).join('');
}
