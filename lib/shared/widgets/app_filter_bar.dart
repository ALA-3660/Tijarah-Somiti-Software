import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppFilterChipItem: ফিল্টার চিপের ডেটা মডেল
class AppFilterChipItem {
  final String id;
  final String label;
  final String? count;
  final bool isSelected;
  final IconData? icon;

  const AppFilterChipItem({
    required this.id,
    required this.label,
    this.count,
    this.isSelected = false,
    this.icon,
  });
}

/// AppFilterBar: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড ফিল্টার বার উইজেট
///
/// অনুভূমিক স্ক্রলেবল ফিল্টার চিপস, অ্যাক্টিভ কাউন্টার ও ক্লিয়ার অল বাটন সাপোর্ট করে।
class AppFilterBar extends StatelessWidget {
  final List<AppFilterChipItem> filters;
  final ValueChanged<AppFilterChipItem> onFilterSelected;
  final VoidCallback? onClearAll;
  final Widget? trailing;
  final String? activeFilterSummary;

  const AppFilterBar({
    super.key,
    required this.filters,
    required this.onFilterSelected,
    this.onClearAll,
    this.trailing,
    this.activeFilterSummary,
  });

  @override
  Widget build(BuildContext context) {
    final hasActiveFilter = filters.any((f) => f.isSelected);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              ...filters.map((filter) {
                final selected = filter.isSelected;
                return Padding(
                  padding: const EdgeInsets.only(right: AppSpacing.xs),
                  child: InkWell(
                    onTap: () => onFilterSelected(filter),
                    borderRadius: AppRadius.radiusFull,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: selected ? AppColors.primary : Colors.white,
                        borderRadius: AppRadius.radiusFull,
                        border: Border.all(
                          color: selected ? AppColors.primary : AppColors.borderLight,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (filter.icon != null) ...[
                            Icon(
                              filter.icon,
                              size: 14,
                              color: selected ? Colors.white : AppColors.textSecondary,
                            ),
                            const SizedBox(width: 4),
                          ],
                          Text(
                            filter.label,
                            style: TextStyle(
                              fontFamily: AppTypography.fontBody,
                              fontSize: 12,
                              fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                              color: selected ? Colors.white : AppColors.textPrimary,
                            ),
                          ),
                          if (filter.count != null) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                              decoration: BoxDecoration(
                                color: selected
                                    ? Colors.white.withOpacity(0.25)
                                    : AppColors.neutral100,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                filter.count!,
                                style: TextStyle(
                                  fontFamily: AppTypography.fontNumeric,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: selected ? Colors.white : AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                );
              }),

              if (hasActiveFilter && onClearAll != null)
                Padding(
                  padding: const EdgeInsets.only(left: AppSpacing.xs),
                  child: TextButton.icon(
                    onPressed: onClearAll,
                    icon: const Icon(Icons.refresh, size: 14, color: AppColors.error),
                    label: const Text(
                      'রিসেট',
                      style: TextStyle(
                        fontFamily: AppTypography.fontBody,
                        fontSize: 11,
                        color: AppColors.error,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      minimumSize: const Size(48, 32),
                    ),
                  ),
                ),

              if (trailing != null) ...[
                const SizedBox(width: AppSpacing.sm),
                trailing!,
              ],
            ],
          ),
        ),

        if (activeFilterSummary != null) ...[
          const SizedBox(height: AppSpacing.xs),
          Text(
            activeFilterSummary!,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}
