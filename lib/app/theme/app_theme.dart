import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_radius.dart';
import 'app_spacing.dart';
import 'app_dimensions.dart';

/// AppTheme: সেন্ট্রাল থিম আর্কিটেকচার (Material 3)
///
/// সম্পূর্ণ ডিজাইন সিস্টেম টোকেন এবং বাংলা টাইপোগ্রাফির সাথে সুসংহত।
class AppTheme {
  AppTheme._();

  /// Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.backgroundLight,
      
      // ColorScheme
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        primaryContainer: AppColors.primaryContainer,
        onPrimaryContainer: AppColors.onPrimaryContainer,
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        secondaryContainer: AppColors.secondaryContainer,
        onSecondaryContainer: AppColors.onSecondaryContainer,
        error: AppColors.error,
        onError: Colors.white,
        errorContainer: AppColors.errorContainer,
        onErrorContainer: AppColors.onErrorContainer,
        surface: AppColors.surfaceLight,
        onSurface: AppColors.textPrimaryLight,
        surfaceContainerHighest: AppColors.surfaceVariantLight,
        outline: AppColors.borderLight,
        outlineVariant: AppColors.dividerLight,
      ),

      // TextTheme
      textTheme: AppTypography.lightTextTheme,

      // AppBar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: AppTypography.fontHeading,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),

      // Card Theme
      cardTheme: CardTheme(
        color: AppColors.surfaceLight,
        elevation: 0,
        shape: AppRadius.shapeLg(
          side: const BorderSide(color: AppColors.borderLight, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),

      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(AppDimensions.buttonHeightLg),
          shape: AppRadius.shapeMd(),
          padding: AppSpacing.buttonPadding,
          textStyle: const TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
          elevation: 0,
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize: const Size.fromHeight(AppDimensions.buttonHeightLg),
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          shape: AppRadius.shapeMd(),
          padding: AppSpacing.buttonPadding,
          textStyle: const TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: const TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: AppSpacing.formFieldPadding,
        border: OutlineInputBorder(
          borderRadius: AppRadius.radiusMd,
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.radiusMd,
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.radiusMd,
          borderSide: const BorderSide(color: AppColors.borderFocusedLight, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppRadius.radiusMd,
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: AppRadius.radiusMd,
          borderSide: const BorderSide(color: AppColors.error, width: 1.8),
        ),
        labelStyle: const TextStyle(
          fontFamily: AppTypography.fontBody,
          fontSize: 14,
          color: AppColors.textSecondaryLight,
        ),
        hintStyle: const TextStyle(
          fontFamily: AppTypography.fontBody,
          fontSize: 14,
          color: AppColors.textTertiaryLight,
        ),
        errorStyle: const TextStyle(
          fontFamily: AppTypography.fontBody,
          fontSize: 12,
          color: AppColors.error,
        ),
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.dividerLight,
        thickness: 1,
        space: 1,
      ),

      // Badge & Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceVariantLight,
        shape: AppRadius.shapeSm(side: const BorderSide(color: AppColors.borderLight)),
        labelStyle: const TextStyle(
          fontFamily: AppTypography.fontNumeric,
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppColors.textPrimaryLight,
        ),
      ),
    );
  }

  /// Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AppColors.primaryLight,
      scaffoldBackgroundColor: AppColors.backgroundDark,
      
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryLight,
        onPrimary: Colors.black,
        secondary: AppColors.secondaryLight,
        onSecondary: Colors.black,
        error: AppColors.error,
        onError: Colors.white,
        surface: AppColors.surfaceDark,
        onSurface: AppColors.textPrimaryDark,
        surfaceContainerHighest: AppColors.surfaceVariantDark,
        outline: AppColors.borderDark,
        outlineVariant: AppColors.dividerDark,
      ),

      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.surfaceDark,
        foregroundColor: AppColors.textPrimaryDark,
        elevation: 0,
      ),

      cardTheme: CardTheme(
        color: AppColors.surfaceDark,
        elevation: 0,
        shape: AppRadius.shapeLg(
          side: const BorderSide(color: AppColors.borderDark, width: 1),
        ),
      ),
    );
  }
}
