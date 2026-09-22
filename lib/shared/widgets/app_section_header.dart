import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

/// AppSectionHeader: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড সেকশন হেডার
class AppSectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? action;
  final IconData? icon;
  final Color? iconColor;
  final bool isCollapsible;
  final bool isCollapsed;
  final VoidCallback? onToggleCollapse;

  const AppSectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.action,
    this.icon,
    this.iconColor,
    this.isCollapsible = false,
    this.isCollapsed = false,
    this.onToggleCollapse,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: 20,
              color: iconColor ?? AppColors.primary,
            ),
            const SizedBox(width: AppSpacing.sm),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
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
                if (subtitle != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    subtitle!,
                    style: const TextStyle(
                      fontFamily: AppTypography.fontBody,
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (action != null) ...[
            const SizedBox(width: AppSpacing.sm),
            action!,
          ],
          if (isCollapsible && onToggleCollapse != null) ...[
            const SizedBox(width: AppSpacing.xs),
            IconButton(
              icon: Icon(
                isCollapsed ? Icons.keyboard_arrow_down : Icons.keyboard_arrow_up,
                color: AppColors.textSecondary,
                size: 20,
              ),
              onPressed: onToggleCollapse,
              tooltip: isCollapsed ? 'প্রসারিত করুন' : 'সংক্ষেপ করুন',
            ),
          ],
        ],
      ),
    );
  }
}
