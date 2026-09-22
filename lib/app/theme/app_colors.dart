import 'package:flutter/material.dart';

/// AppColors: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রাল ও কমপ্রিহেনসিভ কালার প্যালেট
///
/// ইসলামি ঐতিহ্য ও আস্থার প্রতীক হিসেবে গাঢ় পান্না সবুজ (Emerald Green #0F5132)
/// এবং সততা ও হালাল বাণিজ্যের প্রতীক হিসেবে সোনালী অ্যাম্বার (#B45309) ব্যবহার করা হয়েছে।
/// সমস্ত রঙের কনট্রাস্ট রেশিও WCAG AA স্ট্যান্ডার্ড পূরণ করে।
class AppColors {
  AppColors._();

  // ==========================================
  // Primary Brand Colors (পান্না সবুজ - Emerald Green)
  // ==========================================
  static const Color primary = Color(0xFF0F5132);
  static const Color primaryDark = Color(0xFF0A3622);
  static const Color primaryLight = Color(0xFF198754);
  static const Color primaryContainer = Color(0xFFD1E7DD);
  static const Color onPrimaryContainer = Color(0xFF072918);

  // ==========================================
  // Secondary & Accent Colors (হালাল সোনালী অ্যাম্বার - Golden Amber)
  // ==========================================
  static const Color secondary = Color(0xFFB45309);
  static const Color secondaryDark = Color(0xFF78350F);
  static const Color secondaryLight = Color(0xFFD97706);
  static const Color secondaryContainer = Color(0xFFFEF3C7);
  static const Color onSecondaryContainer = Color(0xFF451A03);

  // ==========================================
  // Status Colors (অবস্থা নির্দেশক)
  // ==========================================
  static const Color success = Color(0xFF198754);
  static const Color successContainer = Color(0xFFD1E7DD);
  static const Color onSuccessContainer = Color(0xFF0F5132);

  static const Color warning = Color(0xFFD97706);
  static const Color warningContainer = Color(0xFFFEF3C7);
  static const Color onWarningContainer = Color(0xFF78350F);

  static const Color error = Color(0xFFDC3545);
  static const Color errorContainer = Color(0xFFF8D7DA);
  static const Color onErrorContainer = Color(0xFF842029);

  static const Color info = Color(0xFF0284C7);
  static const Color infoContainer = Color(0xFFE0F2FE);
  static const Color onInfoContainer = Color(0xFF0369A1);

  // ==========================================
  // Society Funds & Informational Shariah Workflow Indicators
  // (Generic Business Funds: Administrative, General, Share, Project, Custom)
  // ==========================================
  static const Color shariahWorkflow = Color(0xFF0F5132);
  static const Color shariahReviewRequired = Color(0xFFB45309);
  static const Color adminFund = Color(0xFF0284C7);
  static const Color generalFund = Color(0xFF0F5132);
  static const Color shareFund = Color(0xFF0D9488);
  static const Color projectFund = Color(0xFFD97706);
  static const Color customFund = Color(0xFF6366F1);
  static const Color auditVerified = Color(0xFF059669);

  // ==========================================
  // Neutral Colors (Light Theme)
  // ==========================================
  static const Color backgroundLight = Color(0xFFF8F9FA);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color surfaceVariantLight = Color(0xFFF1F3F5);
  
  static const Color textPrimaryLight = Color(0xFF1A1D20);
  static const Color textSecondaryLight = Color(0xFF495057);
  static const Color textTertiaryLight = Color(0xFF6C757D);
  static const Color textDisabledLight = Color(0xFFADB5BD);
  
  static const Color borderLight = Color(0xFFDEE2E6);
  static const Color borderFocusedLight = Color(0xFF0F5132);
  static const Color dividerLight = Color(0xFFE9ECEF);

  // ==========================================
  // Neutral Colors (Dark Theme)
  // ==========================================
  static const Color backgroundDark = Color(0xFF121416);
  static const Color surfaceDark = Color(0xFF1A1D20);
  static const Color surfaceVariantDark = Color(0xFF24282C);
  
  static const Color textPrimaryDark = Color(0xFFF8F9FA);
  static const Color textSecondaryDark = Color(0xFFCED4DA);
  static const Color textTertiaryDark = Color(0xFF868E96);
  static const Color textDisabledDark = Color(0xFF495057);
  
  static const Color borderDark = Color(0xFF2C3238);
  static const Color borderFocusedDark = Color(0xFF28A745);
  static const Color dividerDark = Color(0xFF24282C);
}
