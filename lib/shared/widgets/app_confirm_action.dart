import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';
import 'app_button.dart';

/// AppConfirmAction: আর্থিক বা সংবেদনশীল কার্যক্রমের পূর্বে স্পষ্ট নিশ্চিতকরণ উইজেট
class AppConfirmAction extends StatelessWidget {
  final String title;
  final String warningMessage;
  final String? details;
  final String confirmLabel;
  final String cancelLabel;
  final VoidCallback onConfirm;
  final VoidCallback onCancel;
  final bool isDestructive;
  final bool isLoading;
  final IconData icon;

  const AppConfirmAction({
    super.key,
    required this.title,
    required this.warningMessage,
    this.details,
    this.confirmLabel = 'হ্যাঁ, নিশ্চিত করুন',
    this.cancelLabel = 'বাতিল',
    required this.onConfirm,
    required this.onCancel,
    this.isDestructive = false,
    this.isLoading = false,
    this.icon = Icons.warning_amber_rounded,
  });

  @override
  Widget build(BuildContext context) {
    final accentColor = isDestructive ? AppColors.error : AppColors.secondary;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: accentColor.withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: accentColor.withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: accentColor, size: 22),
              ),
              const SizedBox(width: AppSpacing.sm + 2),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontFamily: AppTypography.fontHeading,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          Text(
            warningMessage,
            style: TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 13,
              color: isDestructive ? AppColors.error : AppColors.textPrimary,
              fontWeight: isDestructive ? FontWeight.w500 : FontWeight.normal,
              height: 1.4,
            ),
          ),

          if (details != null) ...[
            const SizedBox(height: AppSpacing.xs),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.neutral50,
                borderRadius: AppRadius.radiusMd,
              ),
              child: Text(
                details!,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],

          const SizedBox(height: AppSpacing.lg),

          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: isLoading ? null : onCancel,
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.textSecondary,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                child: Text(
                  cancelLabel,
                  style: const TextStyle(
                    fontFamily: AppTypography.fontNumeric,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              AppButton(
                label: confirmLabel,
                onPressed: onConfirm,
                variant: isDestructive ? AppButtonVariant.destructive : AppButtonVariant.primary,
                isLoading: isLoading,
                size: AppButtonSize.sm,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
