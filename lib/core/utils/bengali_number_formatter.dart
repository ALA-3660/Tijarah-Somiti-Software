/// BengaliNumberFormatter: ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর ও ফরম্যাটিং
class BengaliNumberFormatter {
  BengaliNumberFormatter._();

  static const Map<String, String> _bengaliDigits = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.',
  };

  /// যেকোনো সংখ্যা বা স্ট্রিংকে বাংলা সংখ্যায় রূপান্তর করে
  /// উদাহরণ: 12500 -> ১২৫০০
  static String toBengali(dynamic input) {
    if (input == null) return '০';
    final str = input.toString();
    final buffer = StringBuffer();

    for (int i = 0; i < str.length; i++) {
      final char = str[i];
      if (_bengaliDigits.containsKey(char)) {
        buffer.write(_bengaliDigits[char]);
      } else {
        buffer.write(char);
      }
    }

    return buffer.toString();
  }

  /// দক্ষিণ এশীয় (Lakh / Crore) কমা ফরম্যাটে বাংলা সংখ্যা তৈরি করে
  /// উদাহরণ: 1250000 -> ১২,৫০,০০০
  static String formatWithCommas(num number, {int decimalPlaces = 0}) {
    final isNegative = number < 0;
    final absNum = number.abs();

    String numStr;
    if (decimalPlaces > 0) {
      numStr = absNum.toStringAsFixed(decimalPlaces);
    } else {
      numStr = absNum.toInt().toString();
    }

    final parts = numStr.split('.');
    String integerPart = parts[0];
    String decimalPart = parts.length > 1 ? '.${parts[1]}' : '';

    if (integerPart.length > 3) {
      final lastThree = integerPart.substring(integerPart.length - 3);
      final remaining = integerPart.substring(0, integerPart.length - 3);
      
      // প্রতি ২ ঘরে কমা
      final regex = RegExp(r'(\d+?)(?=(\d{2})+$)');
      final formattedRemaining = remaining.replaceAllMapped(regex, (match) => '${match[1]},');
      integerPart = '$formattedRemaining,$lastThree';
    }

    final fullFormatted = '${isNegative ? '-' : ''}$integerPart$decimalPart';
    return toBengali(fullFormatted);
  }

  /// শতকরা হার ফরম্যাটিং
  /// উদাহরণ: 12.5 -> ১২.৫%
  static String formatPercentage(num rate, {int decimalPlaces = 1}) {
    final bengaliNum = toBengali(rate.toStringAsFixed(decimalPlaces));
    return '$bengaliNum%';
  }
}
