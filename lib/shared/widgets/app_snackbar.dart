import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppSnackbar: সেন্ট্রালাইজড টোস্ট ও ফিডব্যাক হেল্পার
class AppSnackbar {
  AppSnackbar._();

  static DateTime? _lastShownTime;
  static String? _lastMessage;

  /// ডুপ্লিকেট স্প্যাম রোধক
  static bool _shouldThrottle(String message) {
    final now = DateTime.now();
    if (_lastMessage == message && _lastShownTime != null) {
      if (now.difference(_lastShownTime!) < const Duration(seconds: 2)) {
        return true;
      }
    }
    _lastMessage = message;
    _lastShownTime = now;
    return false;
  }

  static void showSuccess(
    BuildContext context, {
    String message = 'কাজটি সফলভাবে সম্পন্ন হয়েছে।',
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    if (_shouldThrottle(message)) return;
    _show(
      context,
      message: message,
      icon: Icons.check_circle_rounded,
      backgroundColor: AppColors.success,
      duration: duration,
      action: action,
    );
  }

  static void showError(
    BuildContext context, {
    String message = 'কাজটি সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।',
    Duration duration = const Duration(seconds: 4),
    SnackBarAction? action,
  }) {
    if (_shouldThrottle(message)) return;
    _show(
      context,
      message: message,
      icon: Icons.error_rounded,
      backgroundColor: AppColors.error,
      duration: duration,
      action: action,
    );
  }

  static void showWarning(
    BuildContext context, {
    String message = 'দয়া করে তথ্য যাচাই করুন।',
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    if (_shouldThrottle(message)) return;
    _show(
      context,
      message: message,
      icon: Icons.warning_amber_rounded,
      backgroundColor: AppColors.warning,
      duration: duration,
      action: action,
    );
  }

  static void showInfo(
    BuildContext context, {
    String message = 'তথ্যটি বর্তমানে প্রদর্শন করা হচ্ছে।',
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    if (_shouldThrottle(message)) return;
    _show(
      context,
      message: message,
      icon: Icons.info_rounded,
      backgroundColor: AppColors.info,
      duration: duration,
      action: action,
    );
  }

  static void _show(
    BuildContext context, {
    required String message,
    required IconData icon,
    required Color backgroundColor,
    required Duration duration,
    SnackBarAction? action,
  }) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: backgroundColor,
        duration: duration,
        shape: AppRadius.shapeMd(),
        margin: const EdgeInsets.all(AppSpacing.md),
        content: Row(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        action: action,
      ),
    );
  }
}
