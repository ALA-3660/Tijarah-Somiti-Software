import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppListTile: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড লিস্ট আইটেম
///
/// ন্যূনতম ৪৮dp টাচ টার্গেট এবং বাংলা টাইপোগ্রাফি নিশ্চিত করে।
class AppListTile extends StatelessWidget {
  final Widget? leading;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool isSelected;
  final bool isDisabled;
  final EdgeInsetsGeometry? contentPadding;
  final Widget? badge;

  const AppListTile({
    super.key,
    this.leading,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.isSelected = false,
    this.isDisabled = false,
    this.contentPadding,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    Color tileBg = Colors.white;
    if (isSelected) {
      tileBg = AppColors.primary.withOpacity(0.06);
    } else if (isDisabled) {
      tileBg = AppColors.neutral50;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isDisabled ? null : onTap,
        borderRadius: AppRadius.radiusMd,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48.0),
          padding: contentPadding ??
              const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm + 2,
              ),
          decoration: BoxDecoration(
            color: tileBg,
            borderRadius: AppRadius.radiusMd,
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.borderLight,
              width: isSelected ? 1.5 : 1.0,
            ),
          ),
          child: Row(
            children: [
              if (leading != null) ...[
                leading!,
                const SizedBox(width: AppSpacing.md),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: TextStyle(
                              fontFamily: AppTypography.fontHeading,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isDisabled ? AppColors.textTertiary : AppColors.textPrimary,
                            ),
                          ),
                        ),
                        if (badge != null) ...[
                          const SizedBox(width: AppSpacing.xs),
                          badge!,
                        ],
                      ],
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        subtitle!,
                        style: TextStyle(
                          fontFamily: AppTypography.fontBody,
                          fontSize: 12,
                          color: isDisabled ? AppColors.textTertiary : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (trailing != null) ...[
                const SizedBox(width: AppSpacing.sm),
                trailing!,
              ] else if (onTap != null && !isDisabled) ...[
                const SizedBox(width: AppSpacing.sm),
                const Icon(
                  Icons.chevron_right,
                  size: 20,
                  color: AppColors.textTertiary,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
