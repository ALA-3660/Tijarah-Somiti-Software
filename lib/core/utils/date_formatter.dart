import 'package:intl/intl.dart';

/// DateFormatter: তারিখ ও সময় ফরম্যাটিং ইউটিলিটি
class DateFormatter {
  DateFormatter._();

  static final DateFormat _displayFormat = DateFormat('dd MMM yyyy');
  static final DateFormat _displayWithTime = DateFormat('dd MMM yyyy, hh:mm a');
  static final DateFormat _isoFormat = DateFormat('yyyy-MM-dd');

  static String formatDisplay(DateTime dateTime) => _displayFormat.format(dateTime);
  static String formatWithTime(DateTime dateTime) => _displayWithTime.format(dateTime);
  static String formatIso(DateTime dateTime) => _isoFormat.format(dateTime);

  /// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
  static String toBengaliDigits(String input) {
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    String output = input;
    for (int i = 0; i < english.length; i++) {
      output = output.replaceAll(english[i], bengali[i]);
    }
    return output;
  }
}
