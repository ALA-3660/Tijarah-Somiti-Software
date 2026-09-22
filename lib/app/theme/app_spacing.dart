import 'package:flutter/material.dart';

/// AppSpacing: ৪ ও ৮ পিক্সেল গ্রিড ভিত্তিক সেন্ট্রাল স্পেসিং টোকেন
class AppSpacing {
  AppSpacing._();

  /// 4dp - ক্ষুদ্রতম ফাঁকা জায়গা (আইকন ও টেক্সটের মাঝে)
  static const double xs = 4.0;

  /// 8dp - ছোট স্পেসিং (ব্যাজ, বাটন প্যাডিং, লিস্ট আইটেম গ্যাপ)
  static const double sm = 8.0;

  /// 12dp - মাঝারি স্পেসিং (ইনপুট ফিল্ড ও লেবেলের মাঝে)
  static const double md = 12.0;

  /// 16dp - স্ট্যান্ডার্ড কন্টেইনার ও কার্ড প্যাডিং
  static const double lg = 16.0;

  /// 20dp - বড় কন্টেইনার স্পেসিং
  static const double xl = 20.0;

  /// 24dp - সেকশন ডিভাইডার স্পেসিং
  static const double xxl = 24.0;

  /// 32dp - বড় পেজ লেভেল স্পেসিং
  static const double xxxl = 32.0;

  /// 48dp - হিরো স্পেসিং
  static const double hero = 48.0;

  // ==========================================
  // EdgeInsets Shortcuts
  // ==========================================
  static const EdgeInsets paddingZero = EdgeInsets.zero;
  static const EdgeInsets paddingXs = EdgeInsets.all(xs);
  static const EdgeInsets paddingSm = EdgeInsets.all(sm);
  static const EdgeInsets paddingMd = EdgeInsets.all(md);
  static const EdgeInsets paddingLg = EdgeInsets.all(lg);
  static const EdgeInsets paddingXl = EdgeInsets.all(xl);
  static const EdgeInsets paddingXxl = EdgeInsets.all(xxl);

  // Screen horizontal paddings
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(horizontal: lg, vertical: lg);
  static const EdgeInsets cardPadding = EdgeInsets.all(lg);
  static const EdgeInsets dialogPadding = EdgeInsets.all(xxl);
  static const EdgeInsets formFieldPadding = EdgeInsets.symmetric(horizontal: lg, vertical: md);
  static const EdgeInsets buttonPadding = EdgeInsets.symmetric(horizontal: xxl, vertical: md);
}
