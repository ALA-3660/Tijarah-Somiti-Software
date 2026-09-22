import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

/// AppGenericStatus: জেনেরিক সিস্টেম স্ট্যাটাসসমূহ
enum AppGenericStatus {
  draft,
  pending,
  approved,
  rejected,
  active,
  inactive,
  completed,
  cancelled,
  archived,
  requiresReview,
}

enum BadgeVariant {
  primary,
  secondary,
  success,
  warning,
  error,
  info,
  neutral,
}

/// AppStatusBadge: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড স্ট্যাটাস ব্যাজ
class AppStatusBadge extends StatelessWidget {
  final AppGenericStatus status;
  final String? customLabel;
  final bool isPill;

  const AppStatusBadge({
    super.key,
    required this.status,
    this.customLabel,
    this.isPill = true,
  });

  String get _label {
    if (customLabel != null) return customLabel!;
    switch (status) {
      case AppGenericStatus.draft:
        return 'খসড়া';
      case AppGenericStatus.pending:
        return 'অপেক্ষমাণ';
      case AppGenericStatus.approved:
        return 'অনুমোদিত';
      case AppGenericStatus.rejected:
        return 'প্রত্যাখ্যাত';
      case AppGenericStatus.active:
        return 'সক্রিয়';
      case AppGenericStatus.inactive:
        return 'নিষ্ক্রিয়';
      case AppGenericStatus.completed:
        return 'সম্পন্ন';
      case AppGenericStatus.cancelled:
        return 'বাতিল';
      case AppGenericStatus.archived:
        return 'আর্কাইভকৃত';
      case AppGenericStatus.requiresReview:
        return 'পর্যালোচনা প্রয়োজন';
    }
  }

  Color get _bgColor {
    switch (status) {
      case AppGenericStatus.draft:
      case AppGenericStatus.archived:
      case AppGenericStatus.inactive:
        return AppColors.neutral100;
      case AppGenericStatus.pending:
      case AppGenericStatus.requiresReview:
        return AppColors.warning.withOpacity(0.12);
      case AppGenericStatus.approved:
      case AppGenericStatus.active:
      case AppGenericStatus.completed:
        return AppColors.success.withOpacity(0.12);
      case AppGenericStatus.rejected:
      case AppGenericStatus.cancelled:
        return AppColors.error.withOpacity(0.12);
    }
  }

  Color get _textColor {
    switch (status) {
      case AppGenericStatus.draft:
      case AppGenericStatus.archived:
      case AppGenericStatus.inactive:
        return AppColors.textSecondary;
      case AppGenericStatus.pending:
      case AppGenericStatus.requiresReview:
        return AppColors.warning;
      case AppGenericStatus.approved:
      case AppGenericStatus.active:
      case AppGenericStatus.completed:
        return AppColors.success;
      case AppGenericStatus.rejected:
      case AppGenericStatus.cancelled:
        return AppColors.error;
    }
  }

  IconData get _icon {
    switch (status) {
      case AppGenericStatus.draft:
        return Icons.edit_note;
      case AppGenericStatus.pending:
        return Icons.hourglass_top_rounded;
      case AppGenericStatus.approved:
      case AppGenericStatus.active:
      case AppGenericStatus.completed:
        return Icons.check_circle_rounded;
      case AppGenericStatus.rejected:
      case AppGenericStatus.cancelled:
        return Icons.cancel_rounded;
      case AppGenericStatus.archived:
        return Icons.archive_outlined;
      case AppGenericStatus.inactive:
        return Icons.pause_circle_outline;
      case AppGenericStatus.requiresReview:
        return Icons.rate_review_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: _bgColor,
        borderRadius: isPill ? AppRadius.radiusFull : AppRadius.radiusSm,
        border: Border.all(color: _textColor.withOpacity(0.3), width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_icon, size: 12, color: _textColor),
          const SizedBox(width: 4),
          Text(
            _label,
            style: TextStyle(
              fontFamily: AppTypography.fontNumeric,
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: _textColor,
            ),
          ),
        ],
      ),
    );
  }
}

/// AppBadge: সাধারণ স্ট্যাটাস ও ক্যাটাগরি ব্যাজ
class AppBadge extends StatelessWidget {
  final String label;
  final BadgeVariant variant;
  final IconData? icon;

  const AppBadge({
    super.key,
    required this.label,
    this.variant = BadgeVariant.primary,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;

    switch (variant) {
      case BadgeVariant.primary:
        bgColor = AppColors.primaryContainer;
        textColor = AppColors.primaryDark;
        break;
      case BadgeVariant.secondary:
        bgColor = AppColors.secondaryContainer;
        textColor = AppColors.secondaryDark;
        break;
      case BadgeVariant.success:
        bgColor = AppColors.successContainer;
        textColor = AppColors.success;
        break;
      case BadgeVariant.warning:
        bgColor = AppColors.warningContainer;
        textColor = AppColors.warning;
        break;
      case BadgeVariant.error:
        bgColor = AppColors.errorContainer;
        textColor = AppColors.error;
        break;
      case BadgeVariant.info:
        bgColor = AppColors.infoContainer;
        textColor = AppColors.info;
        break;
      case BadgeVariant.neutral:
        bgColor = AppColors.surfaceVariantLight;
        textColor = AppColors.textSecondaryLight;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppRadius.radiusSm,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: textColor),
            const SizedBox(width: AppSpacing.xs),
          ],
          Text(
            label,
            style: TextStyle(
              fontFamily: AppTypography.fontNumeric,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: textColor,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}
