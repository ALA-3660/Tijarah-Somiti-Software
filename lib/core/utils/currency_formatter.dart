import 'bengali_number_formatter.dart';

/// CurrencyFormatter: ইসলামি ফাইন্যান্স ও স্ট্যান্ডার্ড বাংলা মুদ্রা ফরম্যাটার
///
/// আউটপুট ফরম্যাট: ৳ ১,২৫,০০০.০০ অথবা ৳ ২৫,০০০
class CurrencyFormatter {
  CurrencyFormatter._();

  static const String takaSymbol = '৳';

  /// টাকার অংক ফরম্যাট করে বাংলা প্রতীকসহ রিটার্ন করে
  ///
  /// [amount]: টাকার অংক (double / int / num)
  /// [showDecimal]: দশমিকের পর দুই ঘর দেখাতে চাইলে true (ডিফল্ট: false)
  /// [showSign]: ধনাত্মক ও ঋণাত্মক চিহ্ন স্পষ্ট করতে চাইলে true
  static String format(
    num amount, {
    bool showDecimal = false,
    bool showSign = false,
  }) {
    final formattedNum = BengaliNumberFormatter.formatWithCommas(
      amount.abs(),
      decimalPlaces: showDecimal ? 2 : 0,
    );

    if (showSign) {
      if (amount > 0) {
        return '+$takaSymbol $formattedNum';
      } else if (amount < 0) {
        return '-$takaSymbol $formattedNum';
      }
    }

    if (amount < 0) {
      return '-$takaSymbol $formattedNum';
    }

    return '$takaSymbol $formattedNum';
  }

  /// ছোট সংক্ষেপ ফরম্যাট (যেমন: ১.২৫ লক্ষ, ৫ কোটি)
  static String formatCompact(num amount) {
    final absAmount = amount.abs();
    final isNegative = amount < 0;
    final prefix = isNegative ? '-' : '';

    if (absAmount >= 10000000) {
      // কোটি
      final crore = absAmount / 10000000;
      return '$prefix$takaSymbol ${BengaliNumberFormatter.toBengali(crore.toStringAsFixed(2))} কোটি';
    } else if (absAmount >= 100000) {
      // লক্ষ
      final lakh = absAmount / 100000;
      return '$prefix$takaSymbol ${BengaliNumberFormatter.toBengali(lakh.toStringAsFixed(2))} লক্ষ';
    } else if (absAmount >= 1000) {
      // হাজার
      final thousand = absAmount / 1000;
      return '$prefix$takaSymbol ${BengaliNumberFormatter.toBengali(thousand.toStringAsFixed(1))} হাজার';
    }

    return format(amount);
  }
}
