import 'package:flutter/material.dart';

/// AppRadius: মার্জিত ও গাণিতিক বর্ডার রেডিয়াস টোকেন
///
/// নিয়ম: কার্ড বা কন্টেইনারের অভ্যন্তরীণ উপাদানের রেডিয়াস হবে:
/// Inner Radius = Outer Radius - Padding
class AppRadius {
  AppRadius._();

  static const double none = 0.0;
  static const double xs = 4.0;
  static const double sm = 6.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double xxl = 24.0;
  static const double full = 999.0;

  // BorderRadius Shortcuts
  static const BorderRadius radiusNone = BorderRadius.zero;
  static const BorderRadius radiusXs = BorderRadius.all(Radius.circular(xs));
  static const BorderRadius radiusSm = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius radiusMd = BorderRadius.all(Radius.circular(md));
  static const BorderRadius radiusLg = BorderRadius.all(Radius.circular(lg));
  static const BorderRadius radiusXl = BorderRadius.all(Radius.circular(xl));
  static const BorderRadius radiusFull = BorderRadius.all(Radius.circular(full));

  // RoundedRectangleBorder Shortcuts
  static RoundedRectangleBorder shapeMd({BorderSide side = BorderSide.none}) =>
      RoundedRectangleBorder(borderRadius: radiusMd, side: side);

  static RoundedRectangleBorder shapeLg({BorderSide side = BorderSide.none}) =>
      RoundedRectangleBorder(borderRadius: radiusLg, side: side);

  static RoundedRectangleBorder shapeXl({BorderSide side = BorderSide.none}) =>
      RoundedRectangleBorder(borderRadius: radiusXl, side: side);

  static RoundedRectangleBorder shapeFull({BorderSide side = BorderSide.none}) =>
      RoundedRectangleBorder(borderRadius: radiusFull, side: side);
}
