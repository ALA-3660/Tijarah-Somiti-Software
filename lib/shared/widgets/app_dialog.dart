import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';
import 'app_button.dart';

/// AppDialogType: ডায়ালগের ধরণ
enum AppDialogType {
  information,
  confirmation,
  warning,
  error,
  success,
  custom,
}

/// AppDialog: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড রিইউজেবল ডায়ালগ
class AppDialog extends StatelessWidget {
  final AppDialogType type;
  final String title;
  final String? message;
  final Widget? content;
  final String primaryButtonText;
  final VoidCallback? onPrimaryPressed;
  final String? secondaryButtonText;
  final VoidCallback? onSecondaryPressed;
  final bool isDestructive;
  final bool isLoading;
  final bool barrierDismissible;

  const AppDialog({
    super.key,
    this.type = AppDialogType.information,
    required this.title,
    this.message,
    this.content,
    this.primaryButtonText = 'ঠিক আছে',
    this.onPrimaryPressed,
    this.secondaryButtonText,
    this.onSecondaryPressed,
    this.isDestructive = false,
    this.isLoading = false,
    this.barrierDismissible = true,
  });

  /// কনফার্মেশন ডায়ালগ শর্টকাট
  static Future<bool?> showConfirmation(
    BuildContext context, {
    required String title,
    required String message,
    String confirmText = 'হ্যাঁ, নিশ্চিত',
    String cancelText = 'বাতিল',
    bool isDestructive = false,
  }) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AppDialog(
        type: AppDialogType.confirmation,
        title: title,
        message: message,
        primaryButtonText: confirmText,
        secondaryButtonText: cancelText,
        isDestructive: isDestructive,
        onPrimaryPressed: () => Navigator.of(ctx).pop(true),
        onSecondaryPressed: () => Navigator.of(ctx).pop(false),
      ),
    );
  }

  /// ইনফরমেশন ডায়ালগ
  static Future<void> showInfo(
    BuildContext context, {
    required String title,
    required String message,
    String buttonText = 'ঠিক আছে',
  }) {
    return showDialog<void>(
      context: context,
      builder: (ctx) => AppDialog(
        type: AppDialogType.information,
        title: title,
        message: message,
        primaryButtonText: buttonText,
        onPrimaryPressed: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  /// এরর ডায়ালগ
  static Future<void> showError(
    BuildContext context, {
    required String title,
    required String message,
    String buttonText = 'ঠিক আছে',
  }) {
    return showDialog<void>(
      context: context,
      builder: (ctx) => AppDialog(
        type: AppDialogType.error,
        title: title,
        message: message,
        primaryButtonText: buttonText,
        isDestructive: true,
        onPrimaryPressed: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  /// সাকসেস ডায়ালগ
  static Future<void> showSuccess(
    BuildContext context, {
    required String title,
    required String message,
    String buttonText = 'ঠিক আছে',
  }) {
    return showDialog<void>(
      context: context,
      builder: (ctx) => AppDialog(
        type: AppDialogType.success,
        title: title,
        message: message,
        primaryButtonText: buttonText,
        onPrimaryPressed: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  IconData get _icon {
    switch (type) {
      case AppDialogType.information:
        return Icons.info_outline;
      case AppDialogType.confirmation:
        return Icons.help_outline;
      case AppDialogType.warning:
        return Icons.warning_amber_rounded;
      case AppDialogType.error:
        return Icons.error_outline;
      case AppDialogType.success:
        return Icons.check_circle_outline;
      case AppDialogType.custom:
        return Icons.dashboard_outlined;
    }
  }

  Color get _iconColor {
    switch (type) {
      case AppDialogType.information:
        return AppColors.info;
      case AppDialogType.confirmation:
        return isDestructive ? AppColors.error : AppColors.secondary;
      case AppDialogType.warning:
        return AppColors.warning;
      case AppDialogType.error:
        return AppColors.error;
      case AppDialogType.success:
        return AppColors.success;
      case AppDialogType.custom:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: AppRadius.shapeLg(),
      backgroundColor: Colors.white,
      elevation: 4,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with Icon
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: _iconColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Icon(_icon, size: 22, color: _iconColor),
                  ),
                  const SizedBox(width: AppSpacing.sm + 2),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontFamily: AppTypography.fontHeading,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        if (message != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            message!,
                            style: const TextStyle(
                              fontFamily: AppTypography.fontBody,
                              fontSize: 13,
                              color: AppColors.textSecondary,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),

              if (content != null) ...[
                const SizedBox(height: AppSpacing.md),
                content!,
              ],

              const SizedBox(height: AppSpacing.lg),

              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (secondaryButtonText != null) ...[
                    TextButton(
                      onPressed: isLoading ? null : (onSecondaryPressed ?? () => Navigator.of(context).pop()),
                      style: TextButton.styleFrom(
                        foregroundColor: AppColors.textSecondary,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      child: Text(
                        secondaryButtonText!,
                        style: const TextStyle(
                          fontFamily: AppTypography.fontNumeric,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                  ],
                  AppButton(
                    label: primaryButtonText,
                    onPressed: onPrimaryPressed ?? () => Navigator.of(context).pop(),
                    variant: isDestructive ? AppButtonVariant.destructive : AppButtonVariant.primary,
                    isLoading: isLoading,
                    size: AppButtonSize.sm,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
