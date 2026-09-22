import 'package:flutter/material.dart';
import 'app_colors.dart';

/// AppTypography: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রাল টাইপোগ্রাফি আর্কিটেকচার
///
/// টাইপোগ্রাফি ম্যাপিং নীতিমালা:
/// 1. Hind Siliguri: পেজ শিরোনাম, সেকশন হেডার, অ্যাপ বার, ডায়ালগ টাইটেল
/// 2. Baloo Da 2: বাটন, ট্যাব, টাকার অংক (Currency), ব্যালেন্স, শতাংশ (Percentages), কাউন্টার
/// 3. Tiro Bangla: বডি টেক্সট, বিবরণী, ফর্ম লেবেল, ইনপুট হিন্ট, অডিট ও শরিয়াহ নির্দেশিকা
/// 4. JetBrains Mono: ভাউচার কোড, ট্রানজেকশন আইডি, অ্যাকাউন্ট নাম্বার, ক্রিপ্টোগ্রাফিক হ্যাশ
class AppTypography {
  AppTypography._();

  // ==========================================
  // Font Family Names
  // ==========================================
  static const String fontHeading = 'Hind Siliguri';
  static const String fontNumeric = 'Baloo Da 2';
  static const String fontBody = 'Tiro Bangla';
  static const String fontCode = 'JetBrains Mono';

  // ==========================================
  // Light TextTheme Definition
  // ==========================================
  static TextTheme get lightTextTheme {
    return const TextTheme(
      // Display Styles (Hind Siliguri)
      displayLarge: TextStyle(
        fontFamily: fontHeading,
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimaryLight,
        height: 1.25,
        letterSpacing: -0.5,
      ),
      displayMedium: TextStyle(
        fontFamily: fontHeading,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimaryLight,
        height: 1.3,
        letterSpacing: -0.25,
      ),
      displaySmall: TextStyle(
        fontFamily: fontHeading,
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.3,
      ),

      // Headline Styles (Hind Siliguri)
      headlineLarge: TextStyle(
        fontFamily: fontHeading,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimaryLight,
        height: 1.35,
      ),
      headlineMedium: TextStyle(
        fontFamily: fontHeading,
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.35,
      ),
      headlineSmall: TextStyle(
        fontFamily: fontHeading,
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.4,
      ),

      // Title Styles (Hind Siliguri & Baloo Da 2)
      titleLarge: TextStyle(
        fontFamily: fontHeading,
        fontSize: 17,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.4,
      ),
      titleMedium: TextStyle(
        fontFamily: fontHeading,
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.4,
      ),
      titleSmall: TextStyle(
        fontFamily: fontHeading,
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textSecondaryLight,
        height: 1.4,
      ),

      // Body Styles (Tiro Bangla)
      bodyLarge: TextStyle(
        fontFamily: fontBody,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: AppColors.textPrimaryLight,
        height: 1.6,
      ),
      bodyMedium: TextStyle(
        fontFamily: fontBody,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: AppColors.textSecondaryLight,
        height: 1.55,
      ),
      bodySmall: TextStyle(
        fontFamily: fontBody,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: AppColors.textTertiaryLight,
        height: 1.5,
      ),

      // Label Styles (Baloo Da 2 & Tiro Bangla)
      labelLarge: TextStyle(
        fontFamily: fontNumeric,
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
        height: 1.3,
        letterSpacing: 0.2,
      ),
      labelMedium: TextStyle(
        fontFamily: fontNumeric,
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: AppColors.textSecondaryLight,
        height: 1.3,
      ),
      labelSmall: TextStyle(
        fontFamily: fontBody,
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: AppColors.textTertiaryLight,
        height: 1.3,
      ),
    );
  }

  // ==========================================
  // Specialized Financial & Numeric Typography Styles (Baloo Da 2)
  // ==========================================

  /// প্রধান ব্যালেন্স কার্ডের জন্য বড় অংক (যেমন: ৳ ১,২৫,০০,০০০)
  static const TextStyle currencyHero = TextStyle(
    fontFamily: fontNumeric,
    fontSize: 32,
    fontWeight: FontWeight.w800,
    color: AppColors.primary,
    height: 1.2,
    letterSpacing: -0.5,
  );

  /// সেকশন বা কার্ডের বড় আর্থিক অংক
  static const TextStyle currencyLarge = TextStyle(
    fontFamily: fontNumeric,
    fontSize: 24,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimaryLight,
    height: 1.25,
  );

  /// তালিকা বা টেবিলের মাঝারি আর্থিক অংক
  static const TextStyle currencyMedium = TextStyle(
    fontFamily: fontNumeric,
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimaryLight,
    height: 1.3,
  );

  /// ক্ষুদ্র আর্থিক অংক বা সারসংক্ষেপ
  static const TextStyle currencySmall = TextStyle(
    fontFamily: fontNumeric,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AppColors.textSecondaryLight,
    height: 1.3,
  );

  /// ভাউচার নাম্বার ও ট্রানজেকশন আইডির মনোপেস স্টাইল
  static const TextStyle voucherCode = TextStyle(
    fontFamily: fontCode,
    fontSize: 13,
    fontWeight: FontWeight.w600,
    color: AppColors.secondaryDark,
    letterSpacing: 0.5,
  );

  /// অডিট টাইমস্ট্যাম্প ও হ্যাশ
  static const TextStyle auditHash = TextStyle(
    fontFamily: fontCode,
    fontSize: 11,
    fontWeight: FontWeight.w400,
    color: AppColors.textTertiaryLight,
  );
}
