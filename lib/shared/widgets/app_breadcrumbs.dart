import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

/// AppBreadcrumbItem: ব্রেডক্রাম্ব আইটেম
class AppBreadcrumbItem {
  final String label;
  final VoidCallback? onTap;

  const AppBreadcrumbItem({
    required this.label,
    this.onTap,
  });
}

/// AppBreadcrumbs: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড ব্রেডক্রাম্ব উইজেট
class AppBreadcrumbs extends StatelessWidget {
  final List<AppBreadcrumbItem> items;

  const AppBreadcrumbs({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < items.length; i++) ...[
            if (i > 0)
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: AppSpacing.xs),
                child: Icon(
                  Icons.chevron_right,
                  size: 14,
                  color: AppColors.textTertiary,
                ),
              ),
            InkWell(
              onTap: items[i].onTap,
              borderRadius: BorderRadius.circular(4),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 2),
                child: Text(
                  items[i].label,
                  style: TextStyle(
                    fontFamily: AppTypography.fontHeading,
                    fontSize: 12,
                    fontWeight: i == items.length - 1 ? FontWeight.bold : FontWeight.normal,
                    color: i == items.length - 1 ? AppColors.textPrimary : AppColors.primary,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
