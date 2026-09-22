import 'package:flutter/material.dart';

/// AppElevation: মার্জিত শ্যাডো ও এলিভেশন টোকেন (অ্যান্টি-স্লপ ডিজাইন)
class AppElevation {
  AppElevation._();

  static const double none = 0.0;
  static const double low = 1.0;
  static const double medium = 2.0;
  static const double high = 4.0;

  // BoxShadow Definitions
  static const List<BoxShadow> shadowSm = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.04),
      offset: Offset(0, 1),
      blurRadius: 2,
    ),
  ];

  static const List<BoxShadow> shadowMd = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.06),
      offset: Offset(0, 2),
      blurRadius: 6,
    ),
  ];

  static const List<BoxShadow> shadowLg = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.08),
      offset: Offset(0, 4),
      blurRadius: 12,
    ),
  ];
}
